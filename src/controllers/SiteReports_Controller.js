/* eslint-disable camelcase */
/* eslint-disable padded-blocks */
/* eslint-disable curly */
import SiteReports from "../models/SiteReports";
import colors from "colors";
import { validObjectId } from "../helpers/mongoose";
import moment from "moment";
import DSPs from "../models/DSPs";

export const getSiteReportCyclesByLevel = async (req, res) => {

  const { siteId, level } = req.params;
  const { date: queryDate } = req.query;
  if (!validObjectId(siteId)) return res.status(400).json({ message: "Operation not valid" });

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  try {

    const report = await SiteReports
      .findOne({
        site: siteId,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .select("cycles")
      .populate({
        path: "cycles.waves.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      });

    if (!report) return res.status(404).json({ message: "Report does not exist or was deleted" });

    const cycles = report.cycles.map(itemCycle => {

      const { cycle, waves } = itemCycle;
      const auxWaves = waves.map(itemWave => {

        const { wave, checklists } = itemWave;
        const checklist = checklists.find(CL => CL.level === level.toUpperCase()) || null;
        const auxItemWave = { wave, checklist };
        return auxItemWave;

      });

      const auxItemCycle = { cycle, waves: auxWaves };
      return auxItemCycle;

    });

    return res.status(200).json({ id: report._id, cycles });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting report" });

  }

};

export const getSiteReportTimesByLevel = async (req, res) => {

  const { siteId, level } = req.params;
  const { date: queryDate } = req.query;
  if (!validObjectId(siteId)) return res.status(400).json({ message: "Operation not valid" });

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  try {

    const report = await SiteReports
      .findOne({
        site: siteId,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .select("times")
      .populate({
        path: "times.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      });

    if (!report) return res.status(404).json({ message: "Rerport does not exist or was deleted" });

    const times = report.times.map(itemTime => {

      const { time, checklists } = itemTime;
      const checklist = checklists.find(CL => CL.level === level.toUpperCase()) || null;
      const auxItemTime = { time, checklist };
      return auxItemTime;

    });

    return res.status(200).json({ id: report._id, times });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting report" });

  }

};

export const getSiteReportTasksByLevel = async (req, res) => {

  const { siteId, level } = req.params;
  const { date: queryDate } = req.query;
  if (!validObjectId(siteId)) return res.status(400).json({ message: "Operation not valid" });

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  try {

    const report = await SiteReports
      .findOne({
        site: siteId,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .select("tasks")
      .populate({
        path: "tasks.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      });

    if (!report) return res.status(404).json({ message: "Rerport does not exist or was deleted" });

    const tasks = report.tasks.map(itemTask => {

      const { task, checklists } = itemTask;
      const checklist = checklists.find(CL => CL.level === level.toUpperCase()) || null;
      const auxItemTask = { task, checklist };
      return auxItemTask;

    });

    return res.status(200).json({ id: report._id, tasks });

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting report" });

  }

};

export const getTotalProgressByReport = (report) => {
  // SOS list to count
  const SOST1Questions = [];
  const SOST1QuestionsAnswered = [];
  const SOST3Questions = [];
  const SOST3QuestionsAnswered = [];
  const SOSYMQuestions = [];
  const SOSYMQuestionsAnswered = [];
  let droppedRoutes = 0;

  // LOOP ON THE QUESTIONS TYPE CYCLE TO KNOW THE QUESTIONS LENGTH AND THE ANSWERED QUESTION
  report.cycles.forEach(cycle => {
    cycle.waves.forEach(wave => {
      wave.checklists.forEach(check => {
        if (check.disabled) return;
        check.checklist.questions.forEach(question => {
          if (check.level === "T1" || check.level === "t1") {
            SOST1Questions.push(question);
            if (question.responseDate) SOST1QuestionsAnswered.push(question);
          }
          if (check.level === "T3" || check.level === "t3") {
            SOST3Questions.push(question);
            if (question.responseDate) {
              SOST3QuestionsAnswered.push(question);
              if (question.question.label === "Number of Dropped Routes") {
                droppedRoutes = droppedRoutes + parseInt(question.question.answer) || 0;
              };
            }
          }
          if (check.level === "YM" || check.level === "ym") {
            SOSYMQuestions.push(question);
            if (question.responseDate) SOSYMQuestionsAnswered.push(question);
          }
        });
      });
    });
  });
  // Calculate the % of SOS
  const SOST1Progress = Math.round(SOST1QuestionsAnswered.length / SOST1Questions.length * 100);
  const SOST3Progress = Math.round(SOST3QuestionsAnswered.length / SOST3Questions.length * 100);
  const SOSYMProgress = Math.round(SOSYMQuestionsAnswered.length / SOSYMQuestions.length * 100);
  // EOS list to count
  const EOST1Questions = [];
  const EOST1QuestionsAnswered = [];
  const EOST3Questions = [];
  const EOST3QuestionsAnswered = [];
  const EOSYMQuestions = [];
  const EOSYMQuestionsAnswered = [];
  report.times.forEach(time => {
    time.checklists.forEach(check => {
      if (check.disabled) return;
      check.checklist.questions.forEach(question => {
        if (check.level === "T1" || check.level === "t1") {
          EOST1Questions.push(question);
          if (question.responseDate) EOST1QuestionsAnswered.push(question);
        }
        if (check.level === "T3" || check.level === "t3") {
          EOST3Questions.push(question);
          if (question.responseDate) EOST3QuestionsAnswered.push(question);
        }
        if (check.level === "YM" || check.level === "ym") {
          EOSYMQuestions.push(question);
          if (question.responseDate) EOSYMQuestionsAnswered.push(question);
        }
      });
    });
  });
  // Calculate the % of EOS
  const EOST1Progress = Math.round(EOST1QuestionsAnswered.length / EOST1Questions.length * 100);
  const EOST3Progress = Math.round(EOST3QuestionsAnswered.length / EOST3Questions.length * 100);
  const EOSYMProgress = Math.round(EOSYMQuestionsAnswered.length / EOSYMQuestions.length * 100);
  // AM list to count
  const AMQuestions = [];
  const AMQuestionsAnswered = [];
  report.tasks.forEach(task => {
    task.checklists.forEach(check => {
      if (check.disabled) return;
      check.checklist.questions.forEach(question => {
        if (check.level === "AM" || check.level === "am") {
          AMQuestions.push(question);
          if (question.responseDate) AMQuestionsAnswered.push(question);
        }
      });
    });
  });
  // Calculate the % of EOS
  const AMProgress = Math.round(AMQuestionsAnswered.length / AMQuestions.length * 100);
  // TOTAL PROGRESS
  const totalQuestions = AMQuestions.length + EOST1Questions.length + EOST3Questions.length + EOSYMQuestions.length + SOST1Questions.length + SOST3Questions.length + SOSYMQuestions.length;

  const totalQuestionsAnswered = AMQuestionsAnswered.length + EOST1QuestionsAnswered.length + EOST3QuestionsAnswered.length + EOSYMQuestionsAnswered.length + SOST1QuestionsAnswered.length + SOST3QuestionsAnswered.length + SOSYMQuestionsAnswered.length;

  // Calculate the total progress
  const totalProgress = Math.round(totalQuestionsAnswered / totalQuestions * 100);

  const OTDData = calculateOTDByReport(report);

  const calculateOTD = () => {
    const totalQuantity = 100 * OTDData.length;
    let restQuantity = 0;
    OTDData.forEach(element => {
      restQuantity += element.OTD || 0;
    });
    const value = restQuantity / totalQuantity * 100;
    return Math.round(value) ? Math.round(value) : 0;
  };

  return {
    SOST1Progress,
    SOST3Progress,
    SOSYMProgress,
    EOST1Progress,
    EOST3Progress,
    EOSYMProgress,
    AMProgress,
    totalProgress,
    droppedRoutes,
    OTD: calculateOTD()
  };
};

export const getSiteReportProgress = async (req, res) => {

  const { siteId } = req.params;
  const { date: queryDate } = req.query;
  if (!validObjectId(siteId)) return res.status(400).json({ message: "Operation not valid" });

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  try {

    const report = await SiteReports
      .findOne({
        site: siteId,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .populate({
        path: "cycles.waves.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      })
      .populate({
        path: "tasks.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      })
      .populate({
        path: "times.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      });

    if (!report) return res.status(404).json({ message: "Report does not exist or was deleted" });

    const json = getTotalProgressByReport(report);

    return res.status(200).json(json);

  } catch (err) {

    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting report progress" });

  }

};

export const calculateOTDByReport = (report) => {
  // LOOP ON THE QUESTIONS TYPE CYCLE TO GET THE QUESTIONS OF SOS T3

  const OTDQuestions = [];

  report.cycles.forEach(cycle => {

    cycle.waves.forEach(wave => {

      const comments = [];

      const item = {
        wave: wave.wave,
        cycle: cycle.cycle,
        DSP: "",
        planEntry: "",
        planDep: "",
        actualEntry: "",
        actualDep: "",
        planRoutes: "0",
        actualRoutes: "0",
        lateVans: "0",
        onTime: false
      };

      let planRoutes = 0;
      let droppedRoutes = 0;

      wave.checklists.forEach(check => {
        if (check.disabled) return;
        check.checklist.questions.forEach(question => {

          if (check.level === "T3" || check.level === "t3") {

            if (question.question.label === "DSP") item.DSP = question.question.answer;

            if (question.question.label === "Plan Depart") {
              if (question.question.answer) {
                item.planDep = question.question.answer;
                item.planEntry = moment(`2020-01-01 ${question.question.answer}`).subtract(30, "minutes").format("HH:mm");
              }

            }

            if (question.question.label === "First Van in Time") item.actualEntry = question.question.answer;
            if (question.question.label === "Last Van out Time") item.actualDep = question.question.answer;
            if (question.question.label === "Number of Vans Scheduled") planRoutes = question.question.answer || 0;
            if (question.question.label === "Number of Dropped Routes") droppedRoutes = question.question.answer || 0;
            if (question.question.label === "Number of Vans Late to Depart") item.lateVans = question.question.answer || 0;

            if (question.comment) comments.push(question.comment);

          }
        });
      });

      item.planRoutes = planRoutes;
      item.actualRoutes = planRoutes - droppedRoutes;
      const RestVans = parseInt(droppedRoutes) + parseInt(item.lateVans);
      const OTD = (planRoutes - RestVans) / planRoutes * 100;
      if (planRoutes === 0) item.OTD = 100;
      else item.OTD = Math.round(OTD * 100) / 100;
      item.comments = comments;

      const getOnTime = () => {
        if (droppedRoutes && droppedRoutes > 0) return false;
        if (item.lateVans && item.lateVans > 0) return false;
        if (item.OTD !== 100) return false;
        return true;
      };

      item.droppedRoutes = droppedRoutes;

      item.onTime = getOnTime();
      OTDQuestions.push(item);

    });
  });

  return OTDQuestions.filter(data => data.DSP);

};

// Function con calculate the metrics of OTD
export const getSiteReportMetricsOTD = async (req, res) => {

  const { siteId } = req.params;
  const { date: queryDate } = req.query;
  if (!validObjectId(siteId)) return res.status(400).json({ message: "Operation not valid" });

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  try {

    const report = await SiteReports
      .findOne({
        site: siteId,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .populate({
        path: "cycles.waves.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      }).select("cycles");

    if (!report) return res.status(404).json({ message: "Report does not exist or was deleted" });

    const SOST3Questions = calculateOTDByReport(report);

    const answerQuestions = SOST3Questions;

    return res.status(200).json({ answerQuestions });

  } catch (err) {
    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting report progress" });
  }

};

// Function con calculate the metrics of RTS
export const getSiteReportMetricsRTS = async (req, res) => {

  const { siteId } = req.params;
  const { date: queryDate } = req.query;
  if (!validObjectId(siteId)) return res.status(400).json({ message: "Operation not valid" });

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:59.000Z";

  try {

    const report = await SiteReports
      .findOne({
        site: siteId,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .populate({
        path: "times.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      })
      .select("times");

    if (!report) return res.status(404).json({ message: "Report does not exist or was deleted" });

    // GET THE QUESTIONS OF RETURN DRIVER VERIFICATION

    const checklists = report.times[0].checklists;
    const checklistT1 = checklists.find(checklist => checklist.level === "T1");
    const RDVAnswers = checklistT1.checklist.questions[0].question.answer;

    let dsps;
    try {
      const query = siteId ? { site: siteId } : {};
      dsps = await DSPs.find(query);
    } catch (err) {
      console.log(colors.red("ERROR GETTING DSPs"), err);
      return res.status(400).json({ message: "Error getting dsps" });
    }

    const records = [];

    dsps.forEach((dsp) => {

      const DSP = dsp.alias;
      let OODT = 0;
      let BC = 0;
      let UTA = 0;
      let UTL = 0;
      let NSL = 0;
      let Weather = 0;
      const extraPackages = 0;
      let Locker = 0;
      let other = 0;

      RDVAnswers.forEach((answer) => {

        if (answer.dataInfo.DSP === dsp.alias) {

          const isOODT = answer.questionsAnswered.find(answ => answ.question.category === "OODT");
          if (isOODT) OODT = OODT + 1;

          const isBC = answer.questionsAnswered.find(answ => answ.question.category === "Business Closed");
          if (isBC) BC = BC + 1;

          const isUTA = answer.questionsAnswered.find(answ => answ.question.category === "UTA");
          if (isUTA) UTA = UTA + 1;

          const isUTL = answer.questionsAnswered.find(answ => answ.question.category === "UTL");
          if (isUTL) UTL = UTL + 1;

          const isNSL = answer.questionsAnswered.find(answ => answ.question.category === "NSL");
          if (isNSL) NSL = NSL + 1;

          const isWeather = answer.questionsAnswered.find(answ => answ.question.category === "Weather");
          if (isWeather) Weather = Weather + 1;

          const isLocker = answer.questionsAnswered.find(answ => answ.question.category === "Locker");
          if (isLocker) Locker = Locker + 1;

          const isConnectivity = answer.questionsAnswered.find(answ => answ.question.category === "Connectivity");
          if (isConnectivity) other = other + 1;

          const isEquipment = answer.questionsAnswered.find(answ => answ.question.category === "Equipment");
          if (isEquipment) other = other + 1;

          const isNotonRoute = answer.questionsAnswered.find(answ => answ.question.category === "Not on Route");
          if (isNotonRoute) other = other + 1;

        };

      });

      const record = {
        DSP,
        OODT,
        BC,
        UTA_UTL: UTA + UTL,
        NSL,
        Weather,
        extraPackages,
        Locker,
        other
      };

      records.push(record);

    });

    return res.status(200).json({ records });

  } catch (err) {
    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting report progress" });
  }

};

// Function con calculate the metrics of RTS
export const getRegionalMetrics = async (req, res) => {

  const { date: queryDate } = req.query;

  const date = queryDate ? moment(queryDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const startOfDay = date + "T00:00:00.000Z";
  const endOfDay = date + "T23:59:00.000Z";

  try {

    const reports = await SiteReports
      .find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .populate({
        path: "cycles.waves.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      })
      .populate({
        path: "tasks.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      })
      .populate({
        path: "times.checklists.checklist",
        populate: {
          path: "questions.responseUser",
          select: "userName name lastName"
        }
      })
      .populate({
        path: "site",
        select: "name city state alias"
      });

    if (!reports) return res.status(404).json({ message: "Report does not exist or was deleted" });

    const reportsProgress = [];

    reports.forEach(report => {
      const site = report.site.name;
      const progress = getTotalProgressByReport(report);
      reportsProgress.push({ ...progress, site });
    });

    return res.status(200).json({ reportsProgress });

  } catch (err) {
    console.log(colors.red("ERROR GETTING SITE \n"), err);
    return res.status(500).json({ message: "Error getting report progress" });
  }

};
