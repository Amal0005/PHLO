import { Router, Request, Response } from "express";
import {
  creatorLoginController,
  creatorRegisterController,
} from "../../../framework/depInjection/creator/creatorInjections";
import { registerCreatorSchema } from "../../../adapters/validation/creatorSchemas";
import { validate } from "../../middlewares/zodValidator";
import { jwtAuthMiddleware } from "../../middlewares/jwtAuthMiddleware";
import { JwtServices } from "../../../domain/services/user/jwtServices";

export class CreatorRoutes {
  public creatorRouter: Router;
  private jwtServices = new JwtServices();

  constructor() {
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

    // PROTECTED ROUTES
    this.creatorRouter.use(jwtAuthMiddleware(this.jwtServices));

  }
}
