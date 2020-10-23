import { Router } from "express";

import {
  updateReportChecklist
} from "../controllers/Checklists_Controller";

const router = Router();

export default function () {

  router.put("/:id", updateReportChecklist);

  return router;

}
