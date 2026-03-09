import type { NextFunction, Request, Response } from "express";

type    TAsynController = (req:Request, res:Response, next:NextFunction)=> Promise<any>;

export const asyncHandler= (controller:TAsynController): TAsynController=>async(req,res,next)=>{
    try {
        await controller(req,res,next)
    } catch (error) {
        next(error)
    }
}