import { Router, type IRouter } from "express";
import healthRoutes from "@modules/health/health.routes.js";
import authRoutes from "@modules/auth/auth.routes.js";

const routes: IRouter = Router();

routes.use("/auth", authRoutes);
routes.use("", healthRoutes);

export default routes;
