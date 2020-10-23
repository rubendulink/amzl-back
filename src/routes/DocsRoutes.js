import { Router } from "express";
import {
  createDocs,
  getDocs,
  getDoc,
  deleteDocs
} from "../controllers/Docs_Controller";

const router = Router();

export default function () {

  router.get("/", getDocs);

  router.get("/:id", getDoc);

  router.post("/", createDocs);

  router.delete("/:id", deleteDocs);

  return router;

};
