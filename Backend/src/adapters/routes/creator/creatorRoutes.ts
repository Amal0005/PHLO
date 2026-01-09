import { Router, Request, Response } from "express";
import { creatorRegisterController } from "../../../framework/depInjection/creator/creatorInjections";
import { registerCreatorSchema } from "../../../adapters/validation/creatorSchemas";
import { validate } from "../../middlewares/zodValidator";


export class CreatorRoutes {
  public creatorRouter: Router;
  constructor() {
    this.creatorRouter = Router();
    this.setRoutes();
  }
  private setRoutes(): void {
    this.creatorRouter.post(
      "/register",
      validate(registerCreatorSchema),
      (req: Request, res: Response) => creatorRegisterController.register(req, res)
    )
  }
}
