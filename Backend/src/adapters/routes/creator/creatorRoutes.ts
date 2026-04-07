import type { Request, Response } from "express";
import { Router } from "express";
import {
  creatorLoginController,
  creatorRegisterController,
  creatorAuthController,
  creatorProfileController,
  packageController,
  getCategoryController,
  creatorSubscriptionController,
  wallpaperController,
  creatorBookingController,
  leaveController,
  creatorWalletController,
  creatorAnalyticsController,
} from "@/framework/depInjection/creator/creatorInjections";
import {
  registerCreatorSchema,
  loginCreatorSchema,
  verifyCreatorOtpSchema,
  forgotCreatorPasswordSchema,
  resetCreatorPasswordSchema,
  addPackageSchema,
  editPackageSchema,
} from "@/adapters/validation/creatorSchemas";
import { validate } from "@/adapters/middlewares/zodValidator";
import { authorizeRoles } from "@/adapters/middlewares/roleAuthMiddleware";
import { authMiddleware, logoutController, tokenController } from "@/framework/depInjection/user/userInjections";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export class CreatorRoutes {
  public creatorRouter: Router;

  constructor() {
    this.creatorRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.REGISTER,
      validate(registerCreatorSchema),
      (req: Request, res: Response) =>
        creatorRegisterController.register(req, res),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.LOGIN,
      validate(loginCreatorSchema),
      (req: Request, res: Response) => creatorLoginController.login(req, res),
    );
    this.creatorRouter.post(BACKEND_ROUTES.CREATOR.REFRESH_TOKEN, (req, res) =>
      tokenController.refreshToken(req, res),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.FORGOT_PASSWORD,
      validate(forgotCreatorPasswordSchema),
      (req: Request, res: Response) =>
        creatorAuthController.forgotPassword(req, res),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.VERIFY_FORGOT_OTP,
      validate(verifyCreatorOtpSchema),
      (req: Request, res: Response) =>
        creatorAuthController.verifyForgotOtp(req, res),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.RESET_PASSWORD,
      validate(resetCreatorPasswordSchema),
      (req: Request, res: Response) =>
        creatorAuthController.resetPassword(req, res),
    );
    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.CHECK_EMAIL,
      (req: Request, res: Response) =>
        creatorRegisterController.checkExists(req, res),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.VERIFY_OTP,
      validate(verifyCreatorOtpSchema),
      (req: Request, res: Response) =>
        creatorRegisterController.verifyOtp(req, res),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.RESEND_OTP,
      (req: Request, res: Response) =>
        creatorRegisterController.resendOtp(req, res),
    );

    this.creatorRouter.use(
      authMiddleware,
      authorizeRoles("creator"),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.LOGOUT,
      logoutController.logout.bind(logoutController),
    );
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.PROFILE,
      (req: Request, res: Response) =>
        creatorProfileController.getProfile(req, res),
    );
    this.creatorRouter.patch(
      BACKEND_ROUTES.CREATOR.PROFILE,
      (req: Request, res: Response) =>
        creatorProfileController.editProfile(req, res),
    );
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.CATEGORY,
      (req: Request, res: Response) => {
        getCategoryController.getCategory(req, res);
      },
    );
    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.PACKAGE,
      validate(addPackageSchema),
      (req: Request, res: Response) => {
        packageController.addPackage(req, res);
      },
    );
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.PACKAGE,
      (req: Request, res: Response) => {
        packageController.getPackages(req, res);
      },
    );
    this.creatorRouter.patch(
      BACKEND_ROUTES.CREATOR.PACKAGE_DETAIL,
      validate(editPackageSchema),
      (req: Request, res: Response) => {
        packageController.editPackage(req, res);
      },
    );
    this.creatorRouter.delete(
      BACKEND_ROUTES.CREATOR.PACKAGE_DETAIL,
      (req: Request, res: Response) => {
        packageController.deletePackage(req, res);
      },
    );
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.BOOKINGS,
      (req: Request, res: Response) => {
        creatorBookingController.listCreatorBookings(req, res);
      },
    );
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.SUBSCRIPTION,
      (req: Request, res: Response) =>
        creatorSubscriptionController.getSubscriptions(req, res),
    );
    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.SUBSCRIPTION_BUY,
      (req: Request, res: Response) =>
        creatorSubscriptionController.buySubscription(req, res),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.WALLPAPER,
      upload.single("image"),
      (req: Request, res: Response) => {
        wallpaperController.addWallpaper(req, res);
      },
    );
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.WALLPAPER,
      (req: Request, res: Response) => {
        wallpaperController.getWallpapper(req, res)
      }
    )
    this.creatorRouter.delete(
      BACKEND_ROUTES.CREATOR.WALLPAPER_DETAIL,
      (req: Request, res: Response) => {
        wallpaperController.deleteWallpaper(req, res)
      }
    )
    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.LEAVE,
      (req: Request, res: Response) => {
        leaveController.addLeave(req, res)
      }
    )
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.LEAVE,
      (req: Request, res: Response) => {
        leaveController.getLeaves(req, res)
      }
    )
    this.creatorRouter.delete(
      BACKEND_ROUTES.CREATOR.LEAVE_DETAIL,
      (req: Request, res: Response) => {
        leaveController.removeLeave(req, res)
      }
    )
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.WALLET,
      (req: Request, res: Response) => {
        creatorWalletController.getWallet(req, res)
      }
    );
    this.creatorRouter.get(
      BACKEND_ROUTES.CREATOR.ANALYTICS,
      (req: Request, res: Response) => {
        creatorAnalyticsController.getAnalytics(req, res)
      }
    );
  }
}
