import { Router } from "express";
import {loginController,registerController,} from "../../depInjection/user/userInjections";
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
    this.userRouter.post("/register", (req: Request, res: Response) => {
      validate(registerUserSchema)
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
