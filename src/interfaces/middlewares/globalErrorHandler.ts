import { APP_LOG_MESSAGE } from "@common/constants/index.js";
import { ErrorCode } from "@common/enums/errorCode.enum.js";
import { AppError } from "@common/errors/AppError.js";
import { errorResponse, type TError } from "@common/utils/response.js";
import { HTTPSTATUS, type THttpStatusCode } from "@config/http.config.js";
import logger from "@infrastructure/logger/index.js";
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { ZodError } from "zod";

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(APP_LOG_MESSAGE.APP_ERROR, { meta: { error: err } });

  let statusCode: THttpStatusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errors: TError[] = [];
  let errorCode: ErrorCode | undefined = ErrorCode.INTERNAL_SERVER_ERROR;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err?.errorCode;
    message = err.message;
    if (err.errors) errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = HTTPSTATUS.BAD_REQUEST;
    message = "Validation failed";
    errorCode = ErrorCode.VALIDATION_ERROR;
    errors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  } else if (err instanceof Error) {
    // Unknown / unhandled error — don't leak internals in production
    errors = [{ message: err.message }];
  }

  res.status(statusCode).json(errorResponse(message, errorCode, errors, req));
};
