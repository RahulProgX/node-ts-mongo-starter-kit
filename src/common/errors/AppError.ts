import { HTTPSTATUS, type THttpStatusCode } from "../../config/http.config.js";
import type { ErrorCode } from "../enums/errorCode.enum.js";
import type { TError } from "../utils/response.js";



export class AppError extends Error {
  public statusCode: THttpStatusCode;
  public isOperational: boolean;
  public errorCode?:ErrorCode | undefined;
  public errors?: TError[] | undefined;

  constructor(
    message: string,
    statusCode:THttpStatusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?:ErrorCode,
    errors?: TError[] ,
    isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
