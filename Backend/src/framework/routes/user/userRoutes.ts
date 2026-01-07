import { Router } from "express";
import {
  loginController,
  registerController,
} from "../../depInjection/user/userInjections";
import { Request, Response } from "express";
import { validate } from "../../../adapters/middlewares/zodValidator";
import { registerUserSchema } from "../../../adapters/validation/userSchemas";
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
      }
    );

    this.userRouter.post("/verify-otp", (req: Request, res: Response) => {
      registerController.verifyOtp(req, res);
    });
    this.userRouter.post("/resend-otp", (req: Request, res: Response) => {
      registerController.resendOtp(req, res);
    });
    this.userRouter.post("/login", (req: Request, res: Response) => {
      validate(registerUserSchema);

      loginController.login(req, res);
    });
    this.userRouter.post("/forgot-password",(req: Request, res: Response)=>{
      loginController.forgotPassword(req,res)
    })
  }
}
