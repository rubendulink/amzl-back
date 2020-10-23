import { Router } from "express";
import {
  getSites,
  getSite,
  createSite,
  updateSite,
  deleteSite
} from "../controllers/Sites_Controller";
import {
  getSiteReportCyclesByLevel,
  getSiteReportTimesByLevel,
  getSiteReportTasksByLevel,
  getSiteReportProgress,
  getSiteReportMetricsOTD, getSiteReportMetricsRTS, getRegionalMetrics
} from "../controllers/SiteReports_Controller";

const router = Router();

export default function () {

  router.get("/", getSites);

  router.get("/:id", getSite);

  router.post("/", createSite);

  router.put("/:id", updateSite);

  router.delete("/:id", deleteSite);

  router.get("/:siteId/report/cycles/:level", getSiteReportCyclesByLevel);

  router.get("/:siteId/report/times/:level", getSiteReportTimesByLevel);

  router.get("/:siteId/report/tasks/:level", getSiteReportTasksByLevel);

  router.get("/:siteId/report/progress", getSiteReportProgress);

  router.get("/:siteId/report/metrics/otd", getSiteReportMetricsOTD);

  router.get("/:siteId/report/metrics/rts", getSiteReportMetricsRTS);

  router.get("/reports/progress/regional", getRegionalMetrics);

  return router;

};
