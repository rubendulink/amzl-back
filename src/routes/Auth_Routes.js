import { Router } from "express";
import {
  logIn,
  logout,
  verifySession,
  authenticate,
  verifyAccount
} from "../controllers/Auth_Controller";

const router = Router();

export default function () {

  router.get("/", authenticate, verifySession);

  router.post("/", logIn);

  router.delete("/", authenticate, logout);

  router.get("/verify-user/:token", verifyAccount);

  return router;

}
