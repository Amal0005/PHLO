import { Router, Request, Response } from "express";
import { validate } from "../../../adapters/middlewares/zodValidator";
import { registerUserSchema } from "../../../adapters/validation/userSchemas";
import {
  loginController,
  logoutController,
  registerController,
  userAuthController,
  userGoogleController,
  tokenController,
  userProfileController,
} from "../../../framework/depInjection/user/userInjections";
import { loginUserSchema } from "../../validation/loginUserSchema";
import { jwtAuthMiddleware } from "../../middlewares/jwtAuthMiddleware";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { TokenBlacklistService } from "../../../domain/services/tokenBlacklistService";

import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { authorizeRoles } from "@/adapters/middlewares/roleAuthMiddleware";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";

export class UserRoutes {
  public userRouter: Router;

  constructor(
    private _jwtService: JwtServices,
    private _tokenBlacklistService: TokenBlacklistService,
    private _userRepo: IuserRepository,
    private _creatorRepo: IcreatorRepository,
  ) {
    this.userRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.userRouter.post(
      "/register",
      validate(registerUserSchema),
      (req: Request, res: Response) => registerController.register(req, res),
    );

    this.userRouter.post("/verify-otp", (req: Request, res: Response) =>
      registerController.verifyOtp(req, res),
    );

    this.userRouter.post("/resend-otp", (req: Request, res: Response) =>
      registerController.resendOtp(req, res),
    );

    this.userRouter.post(
      "/login",
      validate(loginUserSchema),
      (req: Request, res: Response) => loginController.login(req, res),
    );
    this.userRouter.post("/refresh-token", (req, res) =>
      tokenController.refreshToken(req, res),
    );

    this.userRouter.post("/forgot-password", (req: Request, res: Response) =>
      userAuthController.forgotPassword(req, res),
    );

    this.userRouter.post("/verify-forgot-otp", (req: Request, res: Response) =>
      userAuthController.verifyForgotOtp(req, res),
    );

    this.userRouter.post("/reset-password", (req: Request, res: Response) =>
      userAuthController.resetPassword(req, res),
    );

    this.userRouter.post("/auth/google", (req: Request, res: Response) =>
      userGoogleController.googleLogin(req, res),
    );

    this.userRouter.post(
      "/logout",
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      logoutController.logout.bind(logoutController),
    );
    this.userRouter.get(
      "/profile",
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      (req: Request, res: Response) =>
        userProfileController.getProfile(req, res),
    );
    this.userRouter.patch(
      "/profile",
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      (req: Request, res: Response) =>
        userProfileController.editProfile(req, res),
    );
    this.userRouter.patch(
      "/change-password",
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      (req: Request, res: Response) =>
        userProfileController.changePassword(req, res),
    );
  }
}
