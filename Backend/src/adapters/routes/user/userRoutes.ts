import { Router } from "express";
import { Request, Response } from "express";
import { validate } from "../../../adapters/middlewares/zodValidator";
import { registerUserSchema } from "../../../adapters/validation/userSchemas";
import {
  loginController,
  registerController,
  userAuthController,
  userGoogleController,
} from "../../../framework/depInjection/user/userInjections";
import { loginUserSchema } from "../../validation/loginUserSchema";

export class userRoutes {
  public userRouter: Router;
  constructor() {
    this.userRouter = Router();
    this.setRoutes();
  }
  private setRoutes(): void {
    this.userRouter.post(
      "/register",
      validate(registerUserSchema),
      (req: Request, res: Response) => {
        registerController.register(req, res);
      },
    );

    this.userRouter.post("/verify-otp", (req: Request, res: Response) => {
      registerController.verifyOtp(req, res);
    });
    this.userRouter.post("/resend-otp", (req: Request, res: Response) => {
      registerController.resendOtp(req, res);
    });
    this.userRouter.post(
      "/login",
      validate(loginUserSchema),
      (req: Request, res: Response) => {
        loginController.login(req, res);
      },
    );

    this.userRouter.post("/forgot-password", (req: Request, res: Response) => {
      userAuthController.forgotPassword(req, res);
    });
    this.userRouter.post(
      "/verify-forgot-otp",
      (req: Request, res: Response) => {
        userAuthController.verifyForgotOtp(req, res);
      },
    );
    this.userRouter.post("/reset-password", (req: Request, res: Response) => {
      userAuthController.resetPassword(req, res);
    });
    this.userRouter.post("/auth/google", (req: Request, res: Response) => {
      userGoogleController.googleLogin(req, res);
    });
  }
}
