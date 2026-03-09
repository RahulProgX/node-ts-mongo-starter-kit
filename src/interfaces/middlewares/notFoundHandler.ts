import type { NextFunction, Request, Response } from "express";
import { NotFoundException } from "../../common/utils/errorException.js";

/**
 * Catch-all for routes that didn't match any handler.
 * Must be registered AFTER all routes and BEFORE the global error handler.
 */
export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFoundException(`Route '${_req.originalUrl}' not found`));
};
