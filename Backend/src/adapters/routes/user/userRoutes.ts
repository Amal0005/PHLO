import type { Request, Response } from "express";
import { Router } from "express";
import { validate } from "@/adapters/middlewares/zodValidator";
import {
  registerUserSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  reviewSchema,
  complaintSchema,
  loginUserSchema,
  changePasswordSchema,
} from "@/adapters/validation/userSchemas";
import {
  loginController,
  logoutController,
  registerController,
  userAuthController,
  userGoogleController,
  tokenController,
  getProfileController,
  editProfileController,
  changePasswordController,
  userPackageController,
  getCategoryController,
  userProfileController,
  userBookingController,
  userWalletController,
  userCreatorController,
  authMiddleware,
  userWallpaperController,
  wishlistController,
  reviewController,
} from "@/framework/depInjection/user/userInjections";

import type {
  AuthRequest,
} from "@/adapters/middlewares/jwtAuthMiddleware";

import { authorizeRoles } from "@/adapters/middlewares/roleAuthMiddleware";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";
import { complaintController } from "@/framework/depInjection/complaintInjection";

export class UserRoutes {
  public userRouter: Router;

  constructor() {
    this.userRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.userRouter.post(
      BACKEND_ROUTES.USER.REGISTER,
      validate(registerUserSchema),
      (req: Request, res: Response) => registerController.register(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.VERIFY_OTP,
      validate(verifyOtpSchema),
      (req: Request, res: Response) => registerController.verifyOtp(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.RESEND_OTP,
      (req: Request, res: Response) => registerController.resendOtp(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.LOGIN,
      validate(loginUserSchema),
      (req: Request, res: Response) => loginController.login(req, res),
    );
    this.userRouter.post(BACKEND_ROUTES.USER.REFRESH_TOKEN, (req, res) =>
      tokenController.refreshToken(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.FORGOT_PASSWORD,
      validate(forgotPasswordSchema),
      (req: Request, res: Response) =>
        userAuthController.forgotPassword(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.VERIFY_FORGOT_OTP,
      validate(verifyOtpSchema),
      (req: Request, res: Response) =>
        userAuthController.verifyForgotOtp(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.RESET_PASSWORD,
      validate(resetPasswordSchema),
      (req: Request, res: Response) =>
        userAuthController.resetPassword(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.GOOGLE_AUTH,
      (req: Request, res: Response) =>
        userGoogleController.googleLogin(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.LOGOUT,
      authMiddleware,
      authorizeRoles("user"),
      logoutController.logout.bind(logoutController),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.PROFILE,
      authMiddleware,
      authorizeRoles("user"),
      (req: Request, res: Response) => getProfileController.getProfile(req, res),
    );
    this.userRouter.patch(
      BACKEND_ROUTES.USER.PROFILE,
      authMiddleware,
      authorizeRoles("user"),
      (req: Request, res: Response) => editProfileController.editProfile(req, res),
    );
    this.userRouter.patch(
      BACKEND_ROUTES.USER.CHANGE_PASSWORD,
      authMiddleware,
      authorizeRoles("user"),
      validate(changePasswordSchema),
      (req: Request, res: Response) =>
        changePasswordController.changePassword(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.PACKAGES,
      authMiddleware,
      authorizeRoles("user"),
      (req: Request, res: Response) =>
        userPackageController.listPackages(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.PACKAGE_DETAIL,
      (req: Request, res: Response) =>
        userPackageController.getPackageDetail(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.CATEGORY,
      (req: Request, res: Response) =>
        getCategoryController.getCategory(req, res),
    );

    this.userRouter.get(
      BACKEND_ROUTES.USER.CREATORS,
      (req: Request, res: Response) =>
        userCreatorController.listCreators(req, res),
    );
    this.userRouter.post(
      BACKEND_ROUTES.USER.CHECK_EMAIL,
      authMiddleware,
      (req: Request, res: Response) =>
        userProfileController.checkEmail(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.VERIFY_EMAIL_OTP,
      authMiddleware,
      (req: Request, res: Response) =>
        userProfileController.verifyEmailChangeOtp(req, res),
    );
    this.userRouter.post(
      BACKEND_ROUTES.USER.BOOKINGS_CREATE,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        userBookingController.createBooking(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.CHECK_AVAILABILITY,
      (req: AuthRequest, res: Response) => userBookingController.checkAvailability(req, res)
    );

    this.userRouter.get(
      BACKEND_ROUTES.USER.BOOKINGS_LIST,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        userBookingController.listBookings(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.BOOKING_STATUS,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        userBookingController.getBookingDetail(req, res),
    );
    this.userRouter.post(
      BACKEND_ROUTES.USER.CANCEL_BOOKING,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        userBookingController.cancelBooking(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.DOWNLOAD_INVOICE,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        userBookingController.downloadInvoice(req, res),
    );
    this.userRouter.post(
      BACKEND_ROUTES.USER.RETRY_PAYMENT,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        userBookingController.retryPayment(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.WALLPAPERS,
      authMiddleware,
      (req: AuthRequest, res: Response) =>
        userWallpaperController.getWallpaper(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.WALLPAPER_DOWNLOAD,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        userWallpaperController.recordDownload(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.WISHLIST_TOGGLE,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        wishlistController.toggle(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.WISHLIST,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        wishlistController.getWishlist(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.WISHLIST_IDS,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        wishlistController.getWishlistIds(req, res),
    );
    this.userRouter.post(
      BACKEND_ROUTES.USER.REVIEW,
      authMiddleware,
      authorizeRoles("user"),
      validate(reviewSchema),
      (req: AuthRequest, res: Response) =>
        reviewController.addReview(req, res),
    )
    this.userRouter.delete(
      BACKEND_ROUTES.USER.DELETE_REVIEW,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        reviewController.deleteReview(req, res),
    )
    this.userRouter.get(
      BACKEND_ROUTES.USER.GET_REVIEW,
      (req: Request, res: Response) =>
        reviewController.getReview(req, res),
    )
    this.userRouter.get(
      BACKEND_ROUTES.USER.GET_BOOKING_REVIEW,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        reviewController.getReviewByBooking(req, res),
    )
    this.userRouter.put(
      BACKEND_ROUTES.USER.UPDATE_REVIEW,
      authMiddleware,
      authorizeRoles("user"),
      validate(reviewSchema),
      (req: AuthRequest, res: Response) =>
        reviewController.updateReview(req, res),
    )
    this.userRouter.post(
      BACKEND_ROUTES.USER.BUY_WALLPAPER,
      authMiddleware,
      authorizeRoles("user"),
      (req: AuthRequest, res: Response) =>
        userWallpaperController.buyWallpaper(req, res),
    )
    this.userRouter.post(
      BACKEND_ROUTES.USER.COMPLAINTS,
      authMiddleware,
      authorizeRoles("user"),
      validate(complaintSchema),
      (req: AuthRequest, res: Response) => complaintController.register(req, res)
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.GET_COMPLAINT_BY_BOOKING,
      authMiddleware,
      authorizeRoles("user"),
      (req: Request, res: Response) => complaintController.getByBooking(req, res)
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.WALLET,
      authMiddleware,
      authorizeRoles("user"),
      (req: Request, res: Response) => userWalletController.getWallet(req, res)
    );
  }
}
