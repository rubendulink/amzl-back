import { Router } from "express";
import { createPdf } from "../controllers/Gen_PDF_Controller";

const router = Router();

export default function () {

  router.post("/create", createPdf);

  // router.get("/download", getGeneratePdf);

  return router;

};
