import type { NextFunction, Request, RequestHandler, Response } from "express";

type  TAsyncController = (req:Request, res:Response, next:NextFunction)=> Promise<unknown>;


export const asyncHandler =
  (controller: TAsyncController): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
