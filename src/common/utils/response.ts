import type { Request } from "express";
import type { ErrorCode } from "../enums/errorCode.enum.js";

export interface TApiResponse<T = any> {
  success: boolean;
  message: string;
  errorCode?:ErrorCode | undefined;
  data?: T | undefined;
  errors?: { field?: string; message: string }[] | undefined;
  meta?: {
    timestamp: string;
    path?: string |  undefined;
    method?: string | undefined;
    [key: string]: any;
  };
}

export type TError = { field?: string; message: string };
export function errorResponse(
  message = "Something went wrong.",
  errorCode?:ErrorCode,
  errors?: TError[],
  req?: Request
): TApiResponse<null> {
  return {
    success: false,
    errorCode,
    message,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      path: req?.originalUrl,
      method: req?.method,
    },
  };
}
