import { Router, type IRouter } from "express";
import { authController } from "./auth.module.js";

const authRoutes: IRouter = Router();

authRoutes.post("/register", authController.register);

export default authRoutes;
