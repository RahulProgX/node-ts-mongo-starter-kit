import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import envConfig from "./env.config.js";
import globalRateLimiter from "./rateLimiter.config.js";
import { notFoundHandler } from "@interfaces/http/middlewares/notFoundHandler.middleware.js";
import { globalErrorHandler } from "@interfaces/http/middlewares/globalErrorHandler.middleware.js";
import router from "../interfaces/http/routes/index.js";

const createApp = (): Express => {
  const app = express();

  // --- SECURITY
  /**
   * 1st — sets secure HTTP headers on every response
   */
  app.use(helmet());
  /**
   *  2nd — strips duplicate query params before any parsing
   * `hpp` protects against **HTTP Parameter Pollution**. Without it, an attacker can send: POST /api/v1/auth/login?admin=true&admin=false
   */
  app.use(hpp());

  // ---RATE LIMITING
  /**
   *  3rd — blocks abusive IPs before hitting app logic
   */
  app.use(globalRateLimiter);

  // CORS
  /**
   *  4th — handles preflight before routes
   */
  app.use(
    cors({
      origin: envConfig.APP_ORIGIN,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );

  // --- PARSERS
  /**
   *  5th — parses cookies
   */
  app.use(cookieParser());
  /**
   *  6th — parses body
   */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- ROUTES
  app.use("/api", router);

  // --- CATCH ALL UNMATCHED ROUTES
  app.use(notFoundHandler);

  // --- GLOBAL ERROR HANDLER
  app.use(globalErrorHandler);

  return app;
};

export { createApp };
