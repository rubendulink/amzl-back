import SiteSetups from "../models/SiteSetups";
import { generateSiteReportAction } from "./GenerateSiteReport_Actions";
import colors from "colors";

/**
 * @param {string} siteId - Site ID (mongoose id)
 * @param {string} setupId - Site setup ID (mongoose id)
 */
export default async (siteId, setupId) => {

  console.log(colors.gray("\n======================================"));
  console.log(colors.cyan("GENERATING SITE REPORT"));
  console.log(colors.yellow("SITE : "), colors.gray(siteId));
  console.log(colors.green("SETUP : "), colors.gray(setupId));

  let setup;
  try {

    setup = await SiteSetups.findById(setupId)
      .populate({ path: "questionModels.questionModel" });
    if (!setup) return console.log(colors.red("SETUP NOT EXIST OR WAS DELETE IT: \n"), setupId);

  } catch (err) {

    return console.log(colors.red("ERROR GETTING SITE SETUP :\n"), err);

  }

  try {

    const reportId = await generateSiteReportAction(siteId, setup);
    console.log(colors.green("CREATED SITE REPORT : "), colors.gray(reportId));

  } catch (err) {

    return console.log(colors.red("ERROR GENERATING SITE REPORT : \n"), err);

  }

};
