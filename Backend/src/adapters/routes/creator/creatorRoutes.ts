import { Router, Request, Response } from "express";
import {
  creatorLoginController,
  creatorRegisterController,
  creatorAuthController,
  creatorProfileController,
  addPackageController,
  getPackagesController,
  editPackagesController,
  deletePackageController,
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
      "/register",
      validate(registerCreatorSchema),
      (req: Request, res: Response) =>
        creatorRegisterController.register(req, res),
    );

    this.creatorRouter.post("/login", (req: Request, res: Response) =>
      creatorLoginController.login(req, res),
    );
    this.creatorRouter.post("/refresh-token", (req, res) =>
      tokenController.refreshToken(req, res),
    );

    this.creatorRouter.post("/forgot-password", (req: Request, res: Response) =>
      creatorAuthController.forgotPassword(req, res),
    );

    this.creatorRouter.post(
      "/verify-forgot-otp",
      (req: Request, res: Response) =>
        creatorAuthController.verifyForgotOtp(req, res),
    );

    this.creatorRouter.post("/reset-password", (req: Request, res: Response) =>
      creatorAuthController.resetPassword(req, res),
    );
    this.creatorRouter.post("/check-email", (req: Request, res: Response) =>
      creatorRegisterController.checkExists(req, res),
    );

    this.creatorRouter.post("/verify-otp", (req: Request, res: Response) =>
      creatorRegisterController.verifyOtp(req, res),
    );

    this.creatorRouter.post("/resend-otp", (req: Request, res: Response) =>
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
      "/logout",
      logoutController.logout.bind(logoutController),
    );
    this.creatorRouter.get("/profile", (req: Request, res: Response) =>
      creatorProfileController.getProfile(req, res),
    );
    this.creatorRouter.patch("/profile", (req: Request, res: Response) =>
      creatorProfileController.editProfile(req, res),
    );
    this.creatorRouter.get("/category", (req: Request, res: Response) => {
      getCategoryController.getCategory(req, res);
    });
    this.creatorRouter.post(
      "/package",
      validate(addPackageSchema),
      (req: Request, res: Response) => {
        addPackageController.addPackage(req, res)
      }
    )
    this.creatorRouter.get("/package", (req: Request, res: Response) => {
      getPackagesController.getPackage(req, res);
    });
    this.creatorRouter.patch(
      "/package/:packageId",
      validate(editPackageSchema),
      (req: Request, res: Response) => {
        editPackagesController.editPackage(req, res);
      });
    this.creatorRouter.delete(
      "/package/:packageId",
      (req: Request, res: Response) => {
        deletePackageController.deletePackage(req, res);
      });
  }

}
