import SiteSetups from "../models/SiteSetups";
import Sites from "../models/Sites";
import SiteReports from "../models/SiteReports";
import Checklists from "../models/Checklists";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";
import moment from "moment";

/**
 * Get all Site Setups
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getSiteSetups = async (req, res) => {

  try {

    const setups = await SiteSetups.find()
      .populate({ path: "questionModels.questionModel" });
    return res.status(200).json({ setups });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE SETUPS :\n"), err);
    return res.status(400).json({ message: "Error getting site setups" });

  }

};

/**
 * Get a Site setup
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getSiteSetup = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  try {

    const setup = await SiteSetups.findById(id);

    if (!setup) return res.status(400).json({ message: "Site does not exist or was deleted" });

    return res.status(201).json({ setup });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE SETUP \n"), err);
    return res.status(500).json({ message: "Error getting site setup" });

  }

};

/**
 * Create Site setup
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createSiteSetup = async (req, res) => {

  try {

    const setup = new SiteSetups(req.body);
    await setup.save();

    return res.status(200).json({ id: setup._id });

  } catch (err) {

    console.log(colors.red("ERROR CREATING SITE SETUP:\n"), err);
    return res.status(500).json({ message: "Error creating site setup" });

  }

};

export const generateNewCycleChecklist = async (siteId, reportId, setupId, level, cycle) => {

  console.log("SITE : ", siteId);
  console.log("LEVEL : ", level);
  console.log("GENERATING NEW CHECKLIST FOR CYCLE : ", cycle);

  const setup = await SiteSetups.findById(setupId)
    .populate({ path: "questionModels.questionModel" });
  const questionsModels = setup.questionModels.filter(item => (
    item.questionModel !== null &&
    item.questionModel.modelType === "CYCLE" &&
    item.questionModel.cycle === cycle &&
    item.questionModel.level === level
  ));

  const questions = questionsModels.map(({ questionModel }) => {

    const { question, subQuestions } = questionModel;
    return { question, subQuestions };

  });

  const checklist = new Checklists({ site: siteId, report: reportId, questions });
  await checklist.save();

  return checklist;

};

/**
 * Update Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const updateSiteSetup = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let setup;
  try {

    setup = await SiteSetups.findById(id).select("cycles levels");
    if (!setup) return res.status(400).json({ message: "Site does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE SETUP \n"), err);
    return res.status(500).json({ message: "Error getting site setup" });

  }

  try {

    await setup.updateOne(req.body);
    res.status(200).json({ message: "Site setup updated" });

  } catch (err) {

    console.log(colors.red("ERROR UPDATING SITE SETUP:\n"), err);
    return res.status(500).json({ message: "Error updating site setup" });

  }

  const today = moment().format("YYYY-MM-DD");
  const startOfDay = today + "T00:00:00.000Z";
  const endOfDay = today + "T23:59:59.000Z";

  if (req.body.levels) {

    const cycleLevelsDisalbed = [];
    const timeLevelDisabled = [];
    req.body.levels.forEach(item => item.disabledFor.forEach(type => {

      if (type === "SOS") cycleLevelsDisalbed.push(item.level);

      if (type === "EOS") timeLevelDisabled.push(item.level);

    }));

    const site = await Sites.findOne({ setup: id }).select("_id");
    const siteReport = await SiteReports.findOne({
      site: site._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
      .select("times cycles");

    for (const [cycleIndex, itemCycle] of siteReport.cycles.entries()) {

      for (const [waveIndex, itemWave] of itemCycle.waves.entries()) {

        for (const [checklistIndex, itemChecklist] of itemWave.checklists.entries()) {

          if (cycleLevelsDisalbed.includes(itemChecklist.level)) {

            siteReport.cycles[cycleIndex].waves[waveIndex].checklists[checklistIndex].disabled = true;

          } else {

            siteReport.cycles[cycleIndex].waves[waveIndex].checklists[checklistIndex].disabled = false;

          }

        }

      }

    }

    for (const [timeIndex, itemTime] of siteReport.times.entries()) {

      for (const [checklistIndex, itemChecklist] of itemTime.checklists.entries()) {

        if (timeLevelDisabled.includes(itemChecklist.level)) {

          siteReport.times[timeIndex].checklists[checklistIndex].disabled = true;

        } else {

          siteReport.times[timeIndex].checklists[checklistIndex].disabled = false;

        }

      }

    }

    await siteReport.save();

  }

  if (!req.body.cycles) return;

  try {

    const cyclesUpdated = req.body.cycles;

    const site = await Sites.findOne({ setup: id }).select("_id");
    const siteReport = await SiteReports.findOne({
      site: site._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
      .select("cycles");

    for (const itemCycle of cyclesUpdated) {

      for (const [cycleIndex, reportCycle] of siteReport.cycles.entries()) {

        if (itemCycle.cycle === reportCycle.cycle) {

          if (reportCycle.waves.length > itemCycle.wavesCount) {

            const wavesToDelete = reportCycle.waves.filter(itemWave => itemWave.wave > itemCycle.wavesCount);
            for (const itemWave of wavesToDelete) {

              for (const itemChecklist of itemWave.checklists) {

                console.log("removing checklist :>> ", itemChecklist.checklist);
                await Checklists.remove({ _id: itemChecklist.checklist });

              }

            }

            siteReport.cycles[cycleIndex].waves = reportCycle.waves.filter(itemWave => itemWave.wave < itemCycle.wavesCount);

            await siteReport.save();

          }

          while (reportCycle.waves.length < itemCycle.wavesCount) {

            const wave = siteReport.cycles[cycleIndex].waves.length + 1;

            for (const itemLevel of setup.levels) {

              if (itemLevel.level === "AM") continue;

              const checklist = await generateNewCycleChecklist(
                site._id,
                siteReport._id,
                setup._id,
                itemLevel.level,
                itemCycle.cycle
              );

              const waveIndex = siteReport.cycles[cycleIndex].waves.findIndex(item => item.wave === wave);
              if (waveIndex >= 0) {

                siteReport.cycles[cycleIndex].waves[waveIndex].checklists.push({
                  level: itemLevel.level,
                  checklist: checklist._id
                });

              } else {

                siteReport.cycles[cycleIndex].waves.push({
                  wave,
                  checklists: [
                    {
                      level: itemLevel.level,
                      checklist: checklist._id
                    }
                  ]
                });

              }

            }

          }

        }

      }

    }

    await siteReport.save();

  } catch (err) {

    console.log(colors.red("ERROR GENERATING NEW CYCLES CHECKLISTS:\n"), err);

  }

};

/**
 * Delete Site
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const deleteSiteSetup = async (req, res) => {

  const { id } = req.params;
  if (!validObjectId(id)) return res.status(400).json({ message: "Operation not valid" });

  let setup;

  try {

    setup = await SiteSetups.findById(id);
    if (!setup) return res.status(400).json({ message: "Site setup does not exist or was deleted" });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE SETUP\n"), err);
    return res.status(500).json({ message: "Error getting site setup" });

  }

  try {

    await setup.remove();
    return res.status(200).json({ message: "Site setup deleted" });

  } catch (err) {

    console.log(colors.red("ERROR DELETING SITE SETUP :\n"), err);
    return res.status(500).json({ message: "Error deleting site setup" });

  }

};

/**
 * create main message
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const getMainMsg = async (req, res) => {

  try {

    const { mainMessage } = await SiteSetups.findOne();
    res.status(200).json({ mainMessage });

  } catch (err) {

    console.log(colors.red("ERROR GETTING MAIN MESSAGE:\n"), err);
    return res.status(500).json({ message: "Error getting main message" });

  }

};

/**
 * create main message
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */

export const createMainMsg = async (req, res) => {

  try {

    await SiteSetups.updateMany({}, { $set: { mainMessage: req.body } });

    return res.status(200).json(req.body);

  } catch (err) {

    console.log(colors.red("ERROR CREATING MAIN MESSAGE:\n"), err);
    return res.status(500).json({ message: "Error creating main message" });

  }

};
