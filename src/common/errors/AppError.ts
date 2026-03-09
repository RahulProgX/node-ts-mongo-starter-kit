import { HTTPSTATUS, type THttpStatusCode } from "../../config/http.config.js";
import type { ErrorCode } from "../enums/errorCode.enum.js";

export class AppError extends Error {
  public statusCode: THttpStatusCode;
  public isOperational: boolean;
  public errorCode?:ErrorCode | undefined;
  public errors?: { field?: string; message: string }[] | undefined;

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?:ErrorCode,
    errors?: { field?: string; message: string }[] ,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);
  }
}
