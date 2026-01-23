import { Router, Request, Response } from "express";
import {creatorLoginController,creatorRegisterController,creatorAuthController,} from "@/framework/depInjection/creator/creatorInjections";
import { registerCreatorSchema } from "@/adapters/validation/creatorSchemas";
import { validate } from "@/adapters/middlewares/zodValidator";
import { jwtAuthMiddleware } from "@/adapters/middlewares/jwtAuthMiddleware";
import { JwtServices } from "@/domain/services/user/jwtServices";
import { TokenBlacklistService } from "@/domain/services/tokenBlacklistService";
import { logoutController } from "@/framework/depInjection/user/userInjections";


export class CreatorRoutes {
  public creatorRouter: Router;

  constructor(
    private _jwtService: JwtServices,
    private _tokenBlacklistService: TokenBlacklistService
  ) {
    this.creatorRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    // PUBLIC ROUTES
    this.creatorRouter.post(
      "/register",
      validate(registerCreatorSchema),
      (req: Request, res: Response) =>
        creatorRegisterController.register(req, res)
    );

    this.creatorRouter.post(
      "/login",
      (req: Request, res: Response) =>
        creatorLoginController.login(req, res)
    );

    this.creatorRouter.post(
      "/forgot-password",
      (req: Request, res: Response) =>
        creatorAuthController.forgotPassword(req, res)
    );

    this.creatorRouter.post(
      "/verify-forgot-otp",
      (req: Request, res: Response) =>
        creatorAuthController.verifyForgotOtp(req, res)
    );

    this.creatorRouter.post(
      "/reset-password",
      (req: Request, res: Response) =>
        creatorAuthController.resetPassword(req, res)
    );

    // PROTECTED ROUTES
    this.creatorRouter.use(
      jwtAuthMiddleware(this._jwtService, this._tokenBlacklistService)
    );

    this.creatorRouter.post(
      "/logout",
      logoutController.logout.bind(logoutController)
    );
  }
}
