import Sites from "../models/Sites";
import GenerateSiteReport from "./GenerateSiteReport_Task";
import colors from "colors";

export default async () => {

  try {

    const sites = await Sites.find().select("_id setup");
    for (const site of sites) GenerateSiteReport(site._id, site.setup);

  } catch (err) {

    console.log(colors.red("ERROR GENERATE SITE REPORTS :\n"), err);
    return;

  };

};
