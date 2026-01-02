import { Router } from "express";
import {
  loginController,
  registerController,
} from "../../depInjection/user/userInjections";
import { Request, Response } from "express";
export class userRoutes {
  public userRouter: Router;

  constructor() {
    this.userRouter = Router();
    this.setRoutes();
  }
  private setRoutes(): void {
    console.log("Login route registered");

    this.userRouter.post("/register", (req: Request, res: Response) => {
      registerController.register(req, res);
    });
    this.userRouter.post("/verify-otp",(req:Request,res:Response)=>{
      registerController.verifyOtp(req,res)
    })
    this.userRouter.post("/login", (req: Request, res: Response) => {
      loginController.login(req, res);
    });
  }
}
