import { AppError } from "@common/errors/AppError.js";
import { asyncHandler } from "@common/utils/asyncHandler.js";
import { HTTPSTATUS } from "@config/http.config.js";
import type { Request, Response, NextFunction, RequestHandler } from "express";

export const healthCheck: RequestHandler = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "OK",
    });
  },
);

export const errorCheck: RequestHandler = asyncHandler(async () => {
  throw new AppError("Test error", HTTPSTATUS.BAD_REQUEST);
});
