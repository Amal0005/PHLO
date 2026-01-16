import { Router, Request, Response } from "express";
import { adminCreatorController, adminLoginController, adminUserController } from "../../../framework/depInjection/admin/adminInjections";

export class AdminRoutes {
  public adminRouter: Router;

  constructor() {
    this.adminRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
      this.adminRouter.post(
      "/login",
      (req: Request, res: Response) =>
        adminLoginController.login(req, res)
    );
    this.adminRouter.post(
  "/logout",
  (req: Request, res: Response) =>
    adminLoginController.logout(req, res)
);

    this.adminRouter.get(
      "/users",
      (req: Request, res: Response) =>
        adminUserController.getUsers(req, res)
    );
    this.adminRouter.get(
      "/creators",
      (req:Request,res:Response)=>adminUserController.getCreators(req,res)
    )
    this.adminRouter.patch(
      "/creators/:id/approve",
      (req:Request,res:Response)=>adminCreatorController.approve(req,res)
    )
    this.adminRouter.patch(
      "/creators/:id/reject",
      (req:Request,res:Response)=>adminCreatorController.reject(req,res)
    )
  }
}
