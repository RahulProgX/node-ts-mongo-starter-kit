import type { Request } from "express";
import type { ErrorCode } from "../enums/errorCode.enum.js";
import { HTTPSTATUS, type THttpStatusCode } from "../../config/http.config.js";


export type TError = { field?: string; message: string };

export interface TApiResponse<T = unknown> {
  success: boolean;
  message: string;
  errorCode?:ErrorCode | undefined;
  data?: T | undefined;
  errors?: TError[] | undefined;
  meta?: {
    timestamp: string;
    path?: string |  undefined;
    method?: string | undefined;
    [key: string]: unknown;
  };
}

// ---------- builders ----------

export function successResponse<T>(
  data: T,
  message = "Success",
  meta?: TApiResponse<T>["meta"]
): TApiResponse<T> {
  return {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
}

export function errorResponse(
  message = "Something went wrong.",
  errorCode?: ErrorCode,
  errors?: TError[],
  req?: Request
): TApiResponse<null> {
  return {
    success: false,
    message,
    ...(errorCode !== undefined && { errorCode }),
    ...(errors?.length && { errors }),
    meta: {
      timestamp: new Date().toISOString(),
      path: req?.originalUrl,
      method: req?.method,
    },
  };
}

