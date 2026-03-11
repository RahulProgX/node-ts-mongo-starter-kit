import { asyncHandler } from "@common/utils/asyncHandler.js";
import type { AuthService } from "./auth.service.js";
import type { Request, RequestHandler, Response } from "express";
import { HTTPSTATUS } from "@config/http.config.js";
import { successResponse } from "@common/utils/response.js";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register: RequestHandler = asyncHandler(
    async (req: Request, res: Response): Promise<unknown> => {
      return res
        .status(HTTPSTATUS.CREATED)
        .json(successResponse({}, "User registered successfully"));
    },
  );
}
