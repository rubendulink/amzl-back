import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/Users_Controller";
import { authenticate } from "../controllers/Auth_Controller";

const router = Router();

export default function () {

  router.get("/", authenticate, getUsers);

  router.get("/:id", authenticate, getUser);

  router.post("/", createUser);

  router.put("/:id", authenticate, updateUser);

  router.delete("/:id", authenticate, deleteUser);

  return router;

}
