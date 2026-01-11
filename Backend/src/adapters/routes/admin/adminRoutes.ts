import { Router, Request, Response } from "express";
import { adminLoginController } from "../../../framework/depInjection/admin/adminInjections";

export class AdminRoutes {
  public adminRouter: Router;

  constructor() {
    this.adminRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.adminRouter.post(
      "/login",
      adminLoginController.login.bind(adminLoginController)
    );
  }
}
