import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "@/framework/database/connectDB/connectDB";
import express, { Express } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import redis from "@/framework/redis/redisClient";
import { UserRoutes } from "@/adapters/routes/user/userRoutes";
import { CreatorRoutes } from "@/adapters/routes/creator/creatorRoutes";
import { UploadRoutes } from "@/adapters/routes/uploadRoutes";
import { ViewRoutes } from "@/adapters/routes/viewRoutes";
import { AdminRoutes } from "@/adapters/routes/admin/adminRoutes";
import { JwtServices } from "@/domain/services/user/jwtServices";
import { RedisService } from "@/domain/services/user/redisServices";
import { TokenBlacklistService } from "@/domain/services/tokenBlacklistService";
import { UserRepository } from "@/adapters/repository/user/userRepository";
import { CreatorRepository } from "./adapters/repository/creator/creatorRepository";
import { loggerMiddleware } from "./adapters/middlewares/loggerMiddleware";
import path from "path";

import { BACKEND_ROUTES } from "@/constants/backendRoutes";


export class App {
  private app: Express;
  private database: connectDB;
  private server!: http.Server;

  private _jwtService: JwtServices;
  private _redisService: RedisService;
  private _tokenBlacklistService: TokenBlacklistService;
  private _userRepository: UserRepository;
  private _creatorRepository: CreatorRepository

  constructor() {
    this.app = express();
    this.database = new connectDB();

    this._jwtService = new JwtServices();
    this._redisService = new RedisService();
    this._tokenBlacklistService = new TokenBlacklistService(this._redisService);
    this._userRepository = new UserRepository();
    this._creatorRepository = new CreatorRepository()

    this.setMiddlewares();
    this.setUserRoutes();
    this.setUploadRouter();
    this.setCreatorRoutes();
    this.setViewRouter();
    this.setAdminRouter();
  }
  private setMiddlewares(): void {
    this.app.use(loggerMiddleware)
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );
    this.app.use(cookieParser());
    this.app.use(
      "/public",
      express.static(path.join(process.cwd(), "public"))
    );


  }
  private setUserRoutes(): void {
    const userRoutes = new UserRoutes(
      this._jwtService,
      this._tokenBlacklistService,
      this._userRepository,
      this._creatorRepository
    );
    this.app.use(BACKEND_ROUTES.BASE, userRoutes.userRouter);
  }
  private setCreatorRoutes(): void {
    const creatorRoutes = new CreatorRoutes(
      this._jwtService,
      this._tokenBlacklistService,
      this._userRepository,
      this._creatorRepository
    );
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.CREATOR.BASE}`, creatorRoutes.creatorRouter);
  }

  private setUploadRouter() {
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.UPLOAD.BASE}`, new UploadRoutes().uploadRouter);
  }
  private setViewRouter() {
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.UPLOAD.BASE}`, new ViewRoutes().viewRoutes);
  }
  private setAdminRouter() {
    const adminRoutes = new AdminRoutes(
      this._jwtService,
      this._tokenBlacklistService,
      this._userRepository,
      this._creatorRepository
    );
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.ADMIN.BASE}`, adminRoutes.adminRouter);
  }

  public async listen(): Promise<void> {
    const port = process.env.PORT || 5000;
    try {
      await this.database.connect();
      this.app.listen(port, () =>
        console.log("server running", process.env.PORT),
      );
    } catch (error) {
      console.error(error);
    }
  }
}
(async () => {
  await redis.connect();
})();
const app = new App();
app.listen();
