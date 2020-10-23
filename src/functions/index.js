import cron from "node-cron";
import GenerateSiteReports from "./GenerateSiteReports_Task";

/*
  CRON EXPRESSION OPTIONS

  * 0 - seconds (optional)
  * 1 - minutes (0-59)
  * 2 - hours (0 - 23)
  * 3 - month day (0 - 31)
  * 4 - month name / number (0-12)
  * 5 - week of day name / number (0-7)
*/

cron.schedule("0 0 * * *", GenerateSiteReports);
