import { Router } from "express";
import {
  getSiteSetups,
  getSiteSetup,
  getMainMsg,
  createMainMsg,
  createSiteSetup,
  updateSiteSetup,
  deleteSiteSetup
} from "../controllers/SiteSetups_Controller";

const router = Router();

export default function () {

  router.get("/", getSiteSetups);

  router.get("/:id", getSiteSetup);

  router.post("/", createSiteSetup);

  router.put("/:id", updateSiteSetup);

  router.delete("/:id", deleteSiteSetup);

  router.get("/msg/get", getMainMsg);

  router.post("/msg", createMainMsg);

  return router;

};
