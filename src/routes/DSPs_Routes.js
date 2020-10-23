import { Router } from "express";
import {
  getDSPs,
  getDSP,
  createDSP,
  updateDSP,
  deleteDSP
} from "../controllers/DSPs_Controller";

const router = Router();

export default function () {

  router.get("/", getDSPs);

  router.get("/:id", getDSP);

  router.post("/", createDSP);

  router.put("/:id", updateDSP);

  router.delete("/:id", deleteDSP);

  return router;

}
