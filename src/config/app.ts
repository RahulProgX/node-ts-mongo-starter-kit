import express from "express";
import type { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import envConfig from "./env.config.js";
import globalRateLimiter from "./rateLimiter.config.js";
import { asyncHandler } from "@interfaces/middlewares/asyncHandler.js";
import { HTTPSTATUS } from "./http.config.js";
import { AppError } from "@common/errors/AppError.js";
import { notFoundHandler } from "@interfaces/middlewares/notFoundHandler.js";
import { globalErrorHandler } from "@interfaces/middlewares/globalErrorHandler.js";

const createApp = (): Express => {
  const app = express();

  // Core Middleware
  app.use(globalRateLimiter);
  app.use(helmet());
  app.use(
    cors({
      origin: envConfig.APP_ORIGIN,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get(
    "/",
    asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
      res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "OK",
      });
    }),
  );

  // Error handled test
  app.get(
    "/error-test",
    asyncHandler(async () => {
      throw new AppError("Test error", HTTPSTATUS.BAD_REQUEST);
    }),
  );

  // app.use("/api/v1", router);

  /// Catch-all for unmatched routes
  app.use(notFoundHandler);

  // Global error handler
  app.use(globalErrorHandler);

  return app;
};

export { createApp };
