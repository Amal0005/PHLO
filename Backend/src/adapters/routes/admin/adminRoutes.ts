import { Router, Request, Response } from "express";
import {
  adminCreatorController,
  adminLoginController,
  adminUserController,
} from "../../../framework/depInjection/admin/adminInjections";
import { jwtAuthMiddleware } from "../../middlewares/jwtAuthMiddleware";
import { authorizeRoles } from "../../middlewares/roleAuthMiddleware";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { TokenBlacklistService } from "../../../domain/services/tokenBlacklistService";
import { logoutController } from "../../../framework/depInjection/user/userInjections";

import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";

export class AdminRoutes {
  public adminRouter: Router;

  constructor(
    private _jwtService: JwtServices,
    private _tokenBlacklistService: TokenBlacklistService,
    private _userRepo: IuserRepository,
    private _creatorRepo: IcreatorRepository
    
  ) {
    this.adminRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.adminRouter.post(
      "/login",
      (req: Request, res: Response) =>
        adminLoginController.login(req, res)
    );
    this.adminRouter.use(
      jwtAuthMiddleware(this._jwtService, this._tokenBlacklistService, this._userRepo,this._creatorRepo),
      authorizeRoles("admin")
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
        adminCreatorController.getCreators(req, res)
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
    this.adminRouter.patch("/users/:userId/status", (req: Request, res: Response) => {
      adminUserController.changeUserStatus(req, res)
    })
     this.adminRouter.patch("/creators/:creatorId/status", (req: Request, res: Response) => {
      adminCreatorController.changeCreatorStatus(req, res)
    })
  }
}
