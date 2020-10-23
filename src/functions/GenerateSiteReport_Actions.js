import SiteReports from "../models/SiteReports";
import Checklists from "../models/Checklists";
import moment from "moment";
import colors from "colors";

/**
 * calculate report checklist
 *
 * @param {Document} setup - site setup
 * @param {[{questionModel: Document}]} questionsModels - site setup filtered questions
 * @returns {[object]} - cenverted to JSON the cycles / times / tasks checklists
 */
export const calculateReportChecklists = (setup, questionsModels) => {

  const { levels, cycles, times, tasks } = setup;

  const allowedLevels = levels.map((row) => row.level);
  const allowedCycles = cycles.map((row) => row.cycle);
  const allowedTimes = times.map((row) => moment(row.time).utc().format("hh:mm a").toString());
  const allowedTasks = tasks.map((row) => row.task.toUpperCase());

  const cyclesCLOBJ = {}; // SOS
  const timesCLOBJ = {}; // EOS
  const tasksCLOBJ = {}; // MANAGER

  for (const row of questionsModels) {

    const { questionModel: { level, modelType, time, cycle, task, question, subQuestions } } = row;

    // ignore if question model level not exist in site levels
    if (!allowedLevels.includes(level)) continue;

    if (modelType === "CYCLE") {

      // ignore if question model cycle not exist in site cycles
      if (!allowedCycles.includes(cycle)) continue;
      const wavesCount = cycles.find((row) => row.cycle === cycle).wavesCount;
      const cycleKey = `cycle-${cycle}-wavesCount-${wavesCount}`;

      if (!cyclesCLOBJ[cycleKey]) cyclesCLOBJ[cycleKey] = { [level]: { questions: [] } };

      if (!cyclesCLOBJ[cycleKey][level]) cyclesCLOBJ[cycleKey][level] = { questions: [] };

      cyclesCLOBJ[cycleKey][level].questions.push({ question, subQuestions });

    } else if (modelType === "TIME") {

      const timeHour = moment(time).utc().format("hh:mm a").toString();
      // ignore if question model time not exist in site times
      if (!allowedTimes.includes(timeHour)) continue;

      if (!timesCLOBJ[timeHour]) timesCLOBJ[timeHour] = { [level]: { questions: [] } };

      if (!timesCLOBJ[timeHour][level]) timesCLOBJ[timeHour][level] = { questions: [] };

      timesCLOBJ[timeHour][level].questions.push({ question, subQuestions });

    } else if (modelType === "TASK") {

      // ignore if question model task not exist in site tasks
      if (!allowedTasks.includes(task.toUpperCase())) continue;

      if (!tasksCLOBJ[task]) tasksCLOBJ[task] = { [level]: { questions: [] } };

      if (!tasksCLOBJ[task]) tasksCLOBJ[task][level] = { questions: [] };

      tasksCLOBJ[task][level].questions.push({ question, subQuestions });

    }

  }

  return [cyclesCLOBJ, timesCLOBJ, tasksCLOBJ];

};

/**
 * Generate report checkslits
 * @param {object} cyclesCLOBJ - converted to JSON cycles checklist .
 * @param {object} timesCLOBJ - converted to JSON times checklist.
 * @param {object} tasksCLOBJ - converted to JSON tasks checklist
 */
export const generateReportChecklists = async (siteId, reportId, levelsConfig, cyclesCLOBJ, timesCLOBJ, tasksCLOBJ) => {

  const cycleLevelsDisalbed = [];
  const timeLevelDisabled = [];

  levelsConfig.forEach(item => item.disabledFor.forEach(type => {

    if (type === "SOS") cycleLevelsDisalbed.push(item.level);

    if (type === "EOS") timeLevelDisabled.push(item.level);

  }));

  const today = moment().format("YYYY-MM-DD");
  const cyclesCL = [];
  const timesCL = [];
  const tasksCL = [];

  for (const cycleKey of Object.keys(cyclesCLOBJ)) {

    const cycle = parseInt(cycleKey.split("-")[1]);
    const wavesCount = parseInt(cycleKey.split("-")[3]);
    const cycleLevels = cyclesCLOBJ[cycleKey];
    const cycleRecord = { cycle, waves: [] };

    for (const level of Object.keys(cyclesCLOBJ[cycleKey])) {

      const { questions } = cycleLevels[level];

      for (let wave = 1; wave <= wavesCount; wave++) {

        const checklist = new Checklists({ site: siteId, report: reportId, questions });
        try {

          await checklist.save();
          let waveIndex = cycleRecord.waves.findIndex(item => item.wave === wave);
          if (waveIndex === -1) {

            cycleRecord.waves.push({ wave, checklists: [] });
            waveIndex = cycleRecord.waves.length - 1;

          }

          cycleRecord.waves[waveIndex].checklists.push({
            level,
            checklist: checklist._id,
            disabled: cycleLevelsDisalbed.includes(level)
          });

        } catch (err) {

          console.log(colors.red("ERROR SAVING CYCLE CHECKLIST : \n"), err);
          continue;

        }

      }

    }

    cyclesCL.push(cycleRecord);

  }

  for (const time of Object.keys(timesCLOBJ)) {

    const datetime = moment(`${today} ${time}`, "YYYY-MM-DD hh:mm a").toDate();

    const timeLevels = timesCLOBJ[time];
    for (const level of Object.keys(timeLevels)) {

      const { questions } = timeLevels[level];
      const checklist = new Checklists({ site: siteId, report: reportId, questions });
      try {

        await checklist.save();
        let timeIndex = timesCL.findIndex((item) => moment(item.time).isSame(datetime));
        if (timeIndex === -1) {

          timesCL.push({ time: datetime, checklists: [] });
          timeIndex = timesCL.length - 1;

        }
        timesCL[timeIndex].checklists.push({
          level,
          checklist: checklist._id,
          disabled: timeLevelDisabled.includes(level)
        });

      } catch (err) {

        console.log(colors.red("ERROR SAVING TIME CHECKLIST : \n"), err);
        continue;

      }

    }

  }

  for (const task of Object.keys(tasksCLOBJ)) {

    if (!tasksCL[task]) tasksCL[task] = [];

    const taskLevels = tasksCLOBJ[task];
    for (const level of Object.keys(taskLevels)) {

      const { questions } = taskLevels[level];
      const checklist = new Checklists({ site: siteId, report: reportId, questions });
      try {

        await checklist.save();
        let taskIndex = tasksCL.findIndex((item) => item.task === task);
        if (taskIndex === -1) {

          tasksCL.push({ task, checklists: [] });
          taskIndex = tasksCL.length - 1;

        }
        tasksCL[taskIndex].checklists.push({
          level,
          checklist: checklist._id
        });

      } catch (err) {

        console.log(colors.red("ERROR SAVING TASK CHECKLIST : \n"), err);
        continue;

      }

    }

  }

  return {
    cycles: cyclesCL,
    times: timesCL,
    tasks: tasksCL
  };

};

export const generateSiteReportAction = async (siteId, setup) => {

  const filteredQM = setup.questionModels.filter((qm) => qm != null);
  const [cyclesCLOBJ, timesCLOBJ, tasksCLOBJ] = calculateReportChecklists(setup, filteredQM);
  const report = new SiteReports({ site: siteId });
  const {
    cycles,
    times,
    tasks
  } = await generateReportChecklists(siteId, report._id, setup.levels, cyclesCLOBJ, timesCLOBJ, tasksCLOBJ);

  report.cycles = cycles;
  report.times = times;
  report.tasks = tasks;

  await report.save();

  return report._id;

};
