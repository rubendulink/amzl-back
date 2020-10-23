import { Router } from "express";
import AuthRoutes from "./Auth_Routes";
import UsersRoutes from "./Users_Routes";
import SitesRoutes from "./Sites_Routes";
import QuestionModelsRoutes from "./QuestionModels_Routes";
import SiteSetups from "./SiteSetups_Routes";
import ChecklistsRoutes from "./Checklists_Routes";
import DSPsRoutes from "./DSPs_Routes";
import PNOVRoutes from "./PNOV_Routes";
import EventsRoutes from "./Events_Routes";
import GenPDFRoutes from "./Gen_PDF_Routes";
import CapacityRoutes from "./Capacity_Routes";
import SafetyRoutes from "./SafetyRoutes";
import DocsRoutes from "./DocsRoutes";

const router = Router();

export default function () {

  router.use("/auth", AuthRoutes());

  router.use("/users", UsersRoutes());

  router.use("/sites", SitesRoutes());

  router.use("/dsps", DSPsRoutes());

  router.use("/site-setups", SiteSetups());

  router.use("/checklists", ChecklistsRoutes());

  router.use("/question-models", QuestionModelsRoutes());

  router.use("/pnovs", PNOVRoutes());

  router.use("/safety", SafetyRoutes());

  router.use("/docs", DocsRoutes());

  router.use("/events", EventsRoutes());

  router.use("/gen-pdf", GenPDFRoutes());

  router.use("/capacity", CapacityRoutes());

  return router;

}
