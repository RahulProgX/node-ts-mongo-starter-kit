import { ErrorCode } from "../enums/errorCode.enum.js";
import { AppError } from "../errors/AppError.js";
import { HTTPSTATUS, type THttpStatusCode } from "../../config/http.config.js";

export class HttpException extends AppError {
  constructor(
    message = "Http exception Error",
    statusCode: THttpStatusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCode,
  ) {
    super(message, statusCode, errorCode);
  }
}

export class NotFoundException extends AppError {
  constructor(message = "Resource not found") {
    super(message, HTTPSTATUS.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
  }
}

export class BadRequestException extends AppError {
  constructor(
    message = "Bad Request",
    errorCode: ErrorCode = ErrorCode.VALIDATION_ERROR,
  ) {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode);
  }
}

export class UnAuthorizedException extends AppError {
  constructor(
    message = "Unauthorized Access",
    errorCode: ErrorCode = ErrorCode.ACCESS_UNAUTHORIZED,
  ) {
    super(message, HTTPSTATUS.UNAUTHORIZED, errorCode);
  }
}

export class ForbiddenException extends AppError {
  constructor(
    message = "Forbidden",
    errorCode: ErrorCode = ErrorCode.ACCESS_FORBIDDEN,
  ) {
    super(message, HTTPSTATUS.FORBIDDEN, errorCode);
  }
}

export class InternalServerException extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
  ) {
    super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode);
  }
}

export class ConflictException extends AppError {
  constructor(
    message = "Conflict",
    errorCode: ErrorCode = ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
  ) {
    super(message, HTTPSTATUS.CONFLICT, errorCode);
  }
}

export class TooManyRequestsException extends AppError {
  constructor(
    message = "Too many requests",
    errorCode: ErrorCode = ErrorCode.AUTH_TOO_MANY_ATTEMPTS,
  ) {
    super(message, HTTPSTATUS.TOO_MANY_REQUESTS, errorCode);
  }
}
