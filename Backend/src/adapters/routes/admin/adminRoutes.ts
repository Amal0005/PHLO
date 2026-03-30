import type { Request, Response } from "express";
import { Router } from "express";
import {
  adminLoginController,
  adminUserController,
  adminCreatorController,
  categoryController,
  subscriptionController,
  adminWallpaperController,
  adminWalletController,
  adminDashboardController,
} from "@/framework/depInjection/admin/adminInjections";

import {
  adminLoginSchema,
  categorySchema,
  subscriptionSchema,
  walletCreditSchema,
} from "@/adapters/validation/adminSchemas";
import { validate } from "@/adapters/middlewares/zodValidator";
import { authorizeRoles } from "@/adapters/middlewares/roleAuthMiddleware";
import { authMiddleware, logoutController, tokenController } from "@/framework/depInjection/user/userInjections";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";
import { complaintController } from "@/framework/depInjection/complaintInjection";

export class AdminRoutes {
  public adminRouter: Router;

  constructor() {
    this.adminRouter = Router();
    this.setRoutes();
  }
  private setRoutes(): void {
    this.adminRouter.post(
      BACKEND_ROUTES.ADMIN.LOGIN,
      validate(adminLoginSchema),
      (req: Request, res: Response) =>
        adminLoginController.login(req, res)
    );
    this.adminRouter.post(BACKEND_ROUTES.ADMIN.REFRESH_TOKEN, (req, res) =>
      tokenController.refreshToken(req, res)
    );
    this.adminRouter.use(
      authMiddleware,
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
    this.adminRouter.post(
      BACKEND_ROUTES.ADMIN.CATEGORY,
      validate(categorySchema),
      (req: Request, res: Response) => {
        categoryController.addCategory(req, res)
      })
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.CATEGORY, (req: Request, res: Response) => {
      categoryController.getCategory(req, res)
    })
    this.adminRouter.delete(BACKEND_ROUTES.ADMIN.CATEGORY_DETAIL, (req: Request, res: Response) => {
      categoryController.deleteCategory(req, res)
    })
    this.adminRouter.patch(
      BACKEND_ROUTES.ADMIN.CATEGORY_DETAIL,
      validate(categorySchema),
      (req: Request, res: Response) => {
        categoryController.editCategory(req, res);
      });
    this.adminRouter.post(
      BACKEND_ROUTES.ADMIN.SUBSCRIPTION,
      validate(subscriptionSchema),
      (req: Request, res: Response) => {
        subscriptionController.addSubscription(req, res)
      })
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.SUBSCRIPTION, (req: Request, res: Response) => {
      subscriptionController.getSubscriptions(req, res)
    })
    this.adminRouter.patch(
      BACKEND_ROUTES.ADMIN.SUBSCRIPTION_DETAIL,
      validate(subscriptionSchema),
      (req: Request, res: Response) => {
        subscriptionController.editSubscription(req, res)
      })
    this.adminRouter.delete(BACKEND_ROUTES.ADMIN.SUBSCRIPTION_DETAIL, (req: Request, res: Response) => {
      subscriptionController.deleteSubscription(req, res)
    })
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.WALLPAPERS, (req: Request, res: Response) => {
      adminWallpaperController.getWallpaper(req, res)
    })
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.BLOCK_WALLPAPER, (req: Request, res: Response) => {
      adminWallpaperController.blockWallpaper(req, res)
    })
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.UNBLOCK_WALLPAPER, (req: Request, res: Response) => {
      adminWallpaperController.unblockWallpaper(req, res)
    })

    this.adminRouter.get(BACKEND_ROUTES.ADMIN.WALLET, (req: Request, res: Response) => {
      adminWalletController.getWallet(req, res)
    })
    this.adminRouter.post(
      BACKEND_ROUTES.ADMIN.WALLET_CREDIT,
      validate(walletCreditSchema),
      (req: Request, res: Response) => {
        adminWalletController.creditWallet(req, res)
      })
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.COMPLAINTS, (req: Request, res: Response) => complaintController.getAll(req, res));
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.RESOLVE_COMPLAINT, (req: Request, res: Response) => complaintController.resolve(req, res));
    this.adminRouter.patch(BACKEND_ROUTES.ADMIN.REJECT_COMPLAINT, (req: Request, res: Response) => complaintController.reject(req, res));
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.DASHBOARD_STATS, (req: Request, res: Response) => adminDashboardController.getStats(req, res));
    this.adminRouter.get(BACKEND_ROUTES.ADMIN.DASHBOARD_REPORT, (req: Request, res: Response) => adminDashboardController.downloadReport(req, res));
  }
}
