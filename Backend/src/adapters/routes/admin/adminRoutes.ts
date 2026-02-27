import { Router, Request, Response } from "express";
import {
  adminLoginController,
  adminUserController,
  adminCreatorController,
  categoryController,
  deleteSubscriptionController,
  editSubscriptionController,
  getSubscriptionController,
  addSubscriptionController,
  adminWallpaperController,
} from "../../../framework/depInjection/admin/adminInjections";
import { jwtAuthMiddleware } from "../../middlewares/jwtAuthMiddleware";
import { authorizeRoles } from "../../middlewares/roleAuthMiddleware";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { TokenBlacklistService } from "../../../domain/services/tokenBlacklistService";
import { logoutController, tokenController } from "../../../framework/depInjection/user/userInjections";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";

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
      BACKEND_ROUTES.ADMIN.LOGIN,
      (req: Request, res: Response) =>
        adminLoginController.login(req, res)
    );
    this.adminRouter.post(BACKEND_ROUTES.ADMIN.REFRESH_TOKEN, (req, res) =>
      tokenController.refreshToken(req, res)
    );
    this.adminRouter.use(
      jwtAuthMiddleware(this._jwtService, this._tokenBlacklistService, this._userRepo, this._creatorRepo),
      authorizeRoles("admin")
    );
    this.adminRouter.post(
      BACKEND_ROUTES.ADMIN.LOGOUT,
      logoutController.logout.bind(logoutController)
    );

    this.adminRouter.get(
      BACKEND_ROUTES.ADMIN.USERS,
      (req: Request, res: Response) =>
        adminUserController.getUsers(req, res)
    );
    this.adminRouter.get(
      BACKEND_ROUTES.ADMIN.CREATORS,
      (req: Request, res: Response) =>
        adminCreatorController.getCreators(req, res)
    );
    this.adminRouter.patch(
      BACKEND_ROUTES.ADMIN.APPROVE_CREATOR,
      (req: Request, res: Response) =>
        adminCreatorController.approve(req, res)
    );
    this.adminRouter.patch(
      BACKEND_ROUTES.ADMIN.REJECT_CREATOR,
      (req: Request, res: Response) =>
        adminCreatorController.reject(req, res)
    );
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.USER_STATUS, (req: Request, res: Response) => {
      adminUserController.changeUserStatus(req, res)
    })
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.CREATOR_STATUS, (req: Request, res: Response) => {
      adminCreatorController.changeCreatorStatus(req, res)
    })
    this.adminRouter.post(BACKEND_ROUTES.ADMIN.CATEGORY, (req: Request, res: Response) => {
      categoryController.addCategory(req, res)
    })
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.CATEGORY, (req: Request, res: Response) => {
      categoryController.getCategory(req, res)
    })
    this.adminRouter.delete(BACKEND_ROUTES.ADMIN.CATEGORY_DETAIL, (req: Request, res: Response) => {
      categoryController.deleteCategory(req, res)
    })
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.CATEGORY_DETAIL, (req: Request, res: Response) => {
      categoryController.editCategory(req, res);
    });
    this.adminRouter.post(BACKEND_ROUTES.ADMIN.SUBSCRIPTION, (req: Request, res: Response) => {
      addSubscriptionController.addSubscription(req, res)
    })
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.SUBSCRIPTION, (req: Request, res: Response) => {
      getSubscriptionController.getSubscriptions(req, res)
    })
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.SUBSCRIPTION_DETAIL, (req: Request, res: Response) => {
      editSubscriptionController.editSubscription(req, res)
    })
    this.adminRouter.delete(BACKEND_ROUTES.ADMIN.SUBSCRIPTION_DETAIL, (req: Request, res: Response) => {
      deleteSubscriptionController.deleteSubscription(req, res)
    })
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.WALLPAPERS,(req:Request,res:Response)=>{
      adminWallpaperController.getWallpaper(req,res)
    })
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.APPROVE_WALLPAPER,(req:Request,res:Response)=>{
      adminWallpaperController.approveWallpaper(req,res)
    })
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.REJECT_WALLPAPER,(req:Request,res:Response)=>{
      adminWallpaperController.rejectWallpaper(req,res)
    })
  }
}