import { Router, Request, Response } from "express";
import {
  addCategoryController,
  addSubscriptionController,
  adminCreatorController,
  adminLoginController,
  adminUserController,
  deleteCategoryController,
  deleteSubscriptionController,
  editCategoryController,
  editSubscriptionController,
  getCategoryController,
  getSubscriptionController,
} from "../../../framework/depInjection/admin/adminInjections";
import { jwtAuthMiddleware } from "../../middlewares/jwtAuthMiddleware";
import { authorizeRoles } from "../../middlewares/roleAuthMiddleware";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { TokenBlacklistService } from "../../../domain/services/tokenBlacklistService";
import { logoutController, tokenController } from "../../../framework/depInjection/user/userInjections";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";

export class AdminRoutes {
  public adminRouter: Router;

  constructor(
    private _jwtService: JwtServices,
    private _tokenBlacklistService: TokenBlacklistService,
    private _userRepo: IUserRepository,
    private _creatorRepo: ICreatorRepository,
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
    this.adminRouter.post("/refresh-token", (req, res) =>
      tokenController.refreshToken(req, res)
    );
    this.adminRouter.use(
      jwtAuthMiddleware(this._jwtService, this._tokenBlacklistService, this._userRepo, this._creatorRepo),
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
    this.adminRouter.post("/category", (req: Request, res: Response) => {
      addCategoryController.addCategory(req, res)
    })
    this.adminRouter.get("/category", (req: Request, res: Response) => {
      getCategoryController.getCategory(req, res)
    })
    this.adminRouter.delete("/category/:categoryId", (req: Request, res: Response) => {
      deleteCategoryController.deleteCategory(req, res)
    })
    this.adminRouter.patch("/category/:categoryId", (req: Request, res: Response) => {
      editCategoryController.editCategory(req, res);
    });
    this.adminRouter.post("/subscription",(req:Request,res:Response)=>{
      addSubscriptionController.addSubscription(req,res)
    })
    this.adminRouter.get("/subscription",(req:Request,res:Response)=>{
      getSubscriptionController.getSubscriptions(req,res)
    })
    this.adminRouter.patch("/subscription/:subscriptionId",(req:Request,res:Response)=>{
      editSubscriptionController.editSubscription(req,res)
    })
    this.adminRouter.delete("/subscription/:subscriptionId",(req:Request,res:Response)=>{
      deleteSubscriptionController.deleteSubscription(req,res)
    })
  }
}

