import { Router, Request, Response } from "express";
import {
  creatorLoginController,
  creatorRegisterController,
  creatorAuthController,
  creatorProfileController,
  creatorPackageController,
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
import { IuserRepository } from "@/domain/interface/user/IuserRepository";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";

export class CreatorRoutes {
  public creatorRouter: Router;

  constructor(
    private _jwtService: JwtServices,
    private _tokenBlacklistService: TokenBlacklistService,
    private _userRepo: IuserRepository,
    private _creatorRepo: IcreatorRepository,
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
    this.creatorRouter.post("/package",(req: Request, res: Response)=>{
      creatorPackageController.addPackage(req,res)
    })
        this.creatorRouter.get("/package", (req: Request, res: Response) => {
      creatorPackageController.getPackages(req, res);
    });
  }
}
