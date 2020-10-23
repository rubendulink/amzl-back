import { Router } from "express";
import {
  getCapacity, saveCapacity, getGeneratePdf, getGenerateRegionalPdf
} from "../controllers/Capacity_Controller";

const router = Router();

export default function () {

  router.get("/site/:siteId", getCapacity);

  router.post("/", saveCapacity);

  router.get("/report-pdf/:template/:siteId", getGeneratePdf);

  router.get("/report-multi-pdf/:template/", getGenerateRegionalPdf);

  return router;

}
