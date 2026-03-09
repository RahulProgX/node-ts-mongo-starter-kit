import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import envConfig from "./env.config.js";

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
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
      message: "OK",
    });
  });
  // app.use("/api/v1", router);

  /// Catch-all for unmatched routes
  // app.use(notFoundHandler);

  // Global error handler
  // app.use(globalErrorHandler);

  return app;
};

export { createApp };
