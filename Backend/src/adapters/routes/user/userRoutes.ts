import { Router, Request, Response } from "express";
import { validate } from "../../../adapters/middlewares/zodValidator";
import { registerUserSchema } from "../../../adapters/validation/userSchemas";
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
  listUserPackagesController,
  getPackageDetailController,
  getCategoryController,
  userProfileController,
} from "../../../framework/depInjection/user/userInjections";
import { loginUserSchema } from "../../validation/loginUserSchema";
import { jwtAuthMiddleware } from "../../middlewares/jwtAuthMiddleware";
import { JwtServices } from "../../../domain/services/user/jwtServices";
import { TokenBlacklistService } from "../../../domain/services/tokenBlacklistService";

import { authorizeRoles } from "@/adapters/middlewares/roleAuthMiddleware";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";

export class UserRoutes {
  public userRouter: Router;

  constructor(
    private _jwtService: JwtServices,
    private _tokenBlacklistService: TokenBlacklistService,
    private _userRepo: IUserRepository,
    private _creatorRepo: ICreatorRepository,
  ) {
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
      (req: Request, res: Response) => userAuthController.forgotPassword(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.VERIFY_FORGOT_OTP,
      (req: Request, res: Response) => userAuthController.verifyForgotOtp(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.RESET_PASSWORD,
      (req: Request, res: Response) => userAuthController.resetPassword(req, res),
    );

    this.userRouter.post(BACKEND_ROUTES.USER.GOOGLE_AUTH, (req: Request, res: Response) =>
      userGoogleController.googleLogin(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.LOGOUT,
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      logoutController.logout.bind(logoutController),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.PROFILE,
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      (req: Request, res: Response) => getProfileController.execute(req, res),
    );
    this.userRouter.patch(
      BACKEND_ROUTES.USER.PROFILE,
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      (req: Request, res: Response) => editProfileController.execute(req, res),
    );
    this.userRouter.patch(
      BACKEND_ROUTES.USER.CHANGE_PASSWORD,
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      (req: Request, res: Response) =>
        changePasswordController.execute(req, res),
    );
    this.userRouter.get(
      BACKEND_ROUTES.USER.PACKAGES,
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("user"),
      (req: Request, res: Response) =>
        listUserPackagesController.listPackages(req, res),
    );
    this.userRouter.get(BACKEND_ROUTES.USER.PACKAGE_DETAIL, (req: Request, res: Response) =>
      getPackageDetailController.getPackageDetail(req, res),
    );
    this.userRouter.get(BACKEND_ROUTES.USER.CATEGORY, (req: Request, res: Response) =>
      getCategoryController.getCategory(req, res),
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.CHECK_EMAIL,
      jwtAuthMiddleware(this._jwtService, this._tokenBlacklistService, this._userRepo, this._creatorRepo),
      (req: Request, res: Response) => userProfileController.checkEmail(req, res)
    );

    this.userRouter.post(
      BACKEND_ROUTES.USER.VERIFY_EMAIL_OTP,
      jwtAuthMiddleware(this._jwtService, this._tokenBlacklistService, this._userRepo, this._creatorRepo),
      (req: Request, res: Response) => userProfileController.verifyEmailChangeOtp(req, res)
    );
  }
}
