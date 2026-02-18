import { Router, Request, Response } from "express";
import {
  creatorLoginController,
  creatorRegisterController,
  creatorAuthController,
  creatorProfileController,
  packageController,
  getCategoryController,
} from "@/framework/depInjection/creator/creatorInjections";
import { registerCreatorSchema } from "@/adapters/validation/creatorSchemas";
import { validate } from "@/adapters/middlewares/zodValidator";
import { jwtAuthMiddleware } from "@/adapters/middlewares/jwtAuthMiddleware";
import { authorizeRoles } from "@/adapters/middlewares/roleAuthMiddleware";
import { JwtServices } from "@/domain/services/user/jwtServices";
import { TokenBlacklistService } from "@/domain/services/tokenBlacklistService";
import {
  logoutController,
  tokenController,
} from "@/framework/depInjection/user/userInjections";
import { editPackageSchema } from "@/adapters/validation/packageEditSchema";
import { addPackageSchema } from "@/adapters/validation/packageAddSchema";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";

export class CreatorRoutes {
  public creatorRouter: Router;

  constructor(
    private _jwtService: JwtServices,
    private _tokenBlacklistService: TokenBlacklistService,
    private _userRepo: IUserRepository,
    private _creatorRepo: ICreatorRepository,
  ) {
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

    this.creatorRouter.post(BACKEND_ROUTES.CREATOR.LOGIN, (req: Request, res: Response) =>
      creatorLoginController.login(req, res),
    );
    this.creatorRouter.post(BACKEND_ROUTES.CREATOR.REFRESH_TOKEN, (req, res) =>
      tokenController.refreshToken(req, res),
    );

    this.creatorRouter.post(BACKEND_ROUTES.CREATOR.FORGOT_PASSWORD, (req: Request, res: Response) =>
      creatorAuthController.forgotPassword(req, res),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.VERIFY_FORGOT_OTP,
      (req: Request, res: Response) =>
        creatorAuthController.verifyForgotOtp(req, res),
    );

    this.creatorRouter.post(BACKEND_ROUTES.CREATOR.RESET_PASSWORD, (req: Request, res: Response) =>
      creatorAuthController.resetPassword(req, res),
    );
    this.creatorRouter.post(BACKEND_ROUTES.CREATOR.CHECK_EMAIL, (req: Request, res: Response) =>
      creatorRegisterController.checkExists(req, res),
    );

    this.creatorRouter.post(BACKEND_ROUTES.CREATOR.VERIFY_OTP, (req: Request, res: Response) =>
      creatorRegisterController.verifyOtp(req, res),
    );

    this.creatorRouter.post(BACKEND_ROUTES.CREATOR.RESEND_OTP, (req: Request, res: Response) =>
      creatorRegisterController.resendOtp(req, res),
    );

    this.creatorRouter.use(
      jwtAuthMiddleware(
        this._jwtService,
        this._tokenBlacklistService,
        this._userRepo,
        this._creatorRepo,
      ),
      authorizeRoles("creator"),
    );

    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.LOGOUT,
      logoutController.logout.bind(logoutController),
    );
    this.creatorRouter.get(BACKEND_ROUTES.CREATOR.PROFILE, (req: Request, res: Response) =>
      creatorProfileController.getProfile(req, res),
    );
    this.creatorRouter.patch(BACKEND_ROUTES.CREATOR.PROFILE, (req: Request, res: Response) =>
      creatorProfileController.editProfile(req, res),
    );
    this.creatorRouter.get(BACKEND_ROUTES.CREATOR.CATEGORY, (req: Request, res: Response) => {
      getCategoryController.getCategory(req, res);
    });
    this.creatorRouter.post(
      BACKEND_ROUTES.CREATOR.PACKAGE,
      validate(addPackageSchema),
      (req: Request, res: Response) => {
        packageController.addPackage(req, res)
      }
    )
    this.creatorRouter.get(BACKEND_ROUTES.CREATOR.PACKAGE, (req: Request, res: Response) => {
      packageController.getPackages(req, res);
    });
    this.creatorRouter.patch(
      BACKEND_ROUTES.CREATOR.PACKAGE_DETAIL,
      validate(editPackageSchema),
      (req: Request, res: Response) => {
        packageController.editPackage(req, res);
      });
    this.creatorRouter.delete(
      BACKEND_ROUTES.CREATOR.PACKAGE_DETAIL,
      (req: Request, res: Response) => {
        packageController.deletePackage(req, res);
      });
  }

}
