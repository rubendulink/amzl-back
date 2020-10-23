import { Router } from "express";

import {
  getEvents,
  createEvent,
  deleteEvent
} from "../controllers/Events_Controller";

const router = Router();

export default function () {

  router.get("/", getEvents);

  router.post("/", createEvent);

  router.delete("/:id", deleteEvent);

  return router;

}
