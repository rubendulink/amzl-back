import { Router } from "express";
import {
  getGeneratePdf,
  createSafety,
  getSafetys,
  getSafety
} from "../controllers/Safety_Controller";

const router = Router();

export default function () {

  router.get("/", getSafetys);

  router.get("/:id", getSafety);

  router.post("/", createSafety);

  router.get("/report-pdf/:template/:siteId", getGeneratePdf);

  return router;

};
