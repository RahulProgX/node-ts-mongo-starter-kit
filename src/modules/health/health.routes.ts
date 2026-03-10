import { Router, type IRouter } from "express";
import { errorCheck, healthCheck } from "./health.controller.js";

const router: IRouter = Router();

router.get("/", healthCheck);
router.get("/error", errorCheck);

export default router;
