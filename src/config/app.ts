import express from "express";
import type { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import envConfig from "./env.config.js";
import { globalErrorHandler } from "../interfaces/middlewares/globalErrorHandler.js";
import { HTTPSTATUS } from "./http.config.js";
import { asyncHandler } from "../interfaces/middlewares/asyncHandler.js";
import { AppError } from "../common/errors/AppError.js";

const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: envConfig.APP_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.get("/",asyncHandler( async (_req: Request, res: Response, next:NextFunction) => {
    throw new AppError("Errr occured")
    res.status(HTTPSTATUS.OK).json({
      message: "OK",
    })
  }));

  // app.use("/api/v1", router);

  /// Catch-all for unmatched routes
  // app.use(notFoundHandler);

  // Global error handler
  app.use(globalErrorHandler);

  return app;
};

export { createApp };
