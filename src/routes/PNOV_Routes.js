import { Router } from "express";
import {
  getPNOVs,
  getPNOV,
  createPNOV,
  updatePNOV,
  deletePNOV
} from "../controllers/PNOV_Controller";

const router = Router();

export default function () {

  router.get("/", getPNOVs);

  router.get("/:id", getPNOV);

  router.post("/", createPNOV);

  router.put("/:id", updatePNOV);

  router.delete("/:id", deletePNOV);

  return router;

}
