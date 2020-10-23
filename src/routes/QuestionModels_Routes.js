import { Router } from "express";
import {
  getQuestionModel,
  getQuestionModels,
  createQuestionModel,
  updateQuestionModel,
  deleteQuestionModel
} from "../controllers/QuestionModels_Controller";

const router = Router();

export default function () {

  router.get("/", getQuestionModels);

  router.get("/:id", getQuestionModel);

  router.post("/", createQuestionModel);

  router.put("/:id", updateQuestionModel);

  router.delete("/:id", deleteQuestionModel);

  return router;

}
