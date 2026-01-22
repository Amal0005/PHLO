import { Router, Request, Response } from "express";
import {
  adminCreatorController,
  adminLoginController,
  adminUserController,
} from "../../../framework/depInjection/admin/adminInjections";
import { jwtAuthMiddleware } from "../../middlewares/jwtAuthMiddleware";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { TokenBlacklistService } from "../../../domain/services/tokenBlacklistService";
import { logoutController } from "../../../framework/depInjection/user/userInjections";

export class AdminRoutes {
  public adminRouter: Router;

  constructor(
    private _jwtService: JwtServices,
    private _tokenBlacklistService: TokenBlacklistService
  ) {
    this.adminRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    // PUBLIC ROUTE
    this.adminRouter.post(
      "/login",
      (req: Request, res: Response) =>
        adminLoginController.login(req, res)
    );

    // PROTECTED ROUTES
    this.adminRouter.use(
      jwtAuthMiddleware(this._jwtService, this._tokenBlacklistService)
    );

    this.adminRouter.post(
      "/logout",
      logoutController.logout.bind(logoutController)
    );

    this.adminRouter.get(
      "/users",
      (req: Request, res: Response) =>
        adminUserController.getUsers(req, res)
    );

    this.adminRouter.get(
      "/creators",
      (req: Request, res: Response) =>
        adminUserController.getCreators(req, res)
    );

    this.adminRouter.patch(
      "/creators/:id/approve",
      (req: Request, res: Response) =>
        adminCreatorController.approve(req, res)
    );

    this.adminRouter.patch(
      "/creators/:id/reject",
      (req: Request, res: Response) =>
        adminCreatorController.reject(req, res)
    );
  }
}
