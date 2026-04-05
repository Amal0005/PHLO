import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "@/framework/database/connectDB/connectDB";
import express, { type Express } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import redis from "@/framework/redis/redisClient";
import { UserRoutes } from "@/adapters/routes/user/userRoutes";
import { CreatorRoutes } from "@/adapters/routes/creator/creatorRoutes";
import { UploadRoutes } from "@/adapters/routes/uploadRoutes";
import { ViewRoutes } from "@/adapters/routes/viewRoutes";
import { AdminRoutes } from "@/adapters/routes/admin/adminRoutes";
import chatRouter from "@/adapters/routes/chatRoutes";
import notificationRouter from "@/adapters/routes/notificationRoutes";
import { SocketIOHandler } from "@/framework/socket/socketIOHandler";
import { loggerMiddleware } from "@/adapters/middlewares/loggerMiddleware";
import path from "path";

import { BACKEND_ROUTES } from "@/constants/backendRoutes";
import { errorHandler } from "@/adapters/middlewares/errorHandler";
import { logger } from "@/utils/logger";
import { paymentController } from "@/framework/depInjection/user/userInjections";
import { paymentReleaseScheduler, subscriptionScheduler } from "@/framework/depInjection/schedulerInjections";


export class App {
  private app: Express;
  private database: connectDB;
  private server!: http.Server;

  constructor() {
    this.app = express();
    this.database = new connectDB();

  this.app.get("/", (req, res) => {
    res.send("PHLO Backend is Live 🚀");
  });


    this.setMiddlewares();
    this.setUserRoutes();
    this.setUploadRouter();
    this.setCreatorRoutes();
    this.setViewRouter();
    this.setAdminRouter();
    this.setChatRoutes();
    this.setNotificationRoutes();
    this.app.use(errorHandler);
  }
  private setMiddlewares(): void {

  this.app.use(
    cors({
      origin: ["https://phlo.website", "http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  this.app.options("*", cors());

  this.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://phlo.website");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
  });

  this.app.use(loggerMiddleware);

  this.app.use(
    BACKEND_ROUTES.WEBHOOK,
    express.raw({ type: "application/json" })
  );

  this.app.post(BACKEND_ROUTES.WEBHOOK, (req, res) =>
    paymentController.handleWebhook(req, res)
  );

  this.app.use(express.json({ limit: "50mb" }));
  this.app.use(express.urlencoded({ limit: "50mb", extended: true }));

  this.app.use(cookieParser());

  this.app.use(
    BACKEND_ROUTES.PUBLIC,
    express.static(path.join(process.cwd(), "public"))
  );
}
  private setUserRoutes(): void {
    const userRoutes = new UserRoutes();
    this.app.use(BACKEND_ROUTES.BASE, userRoutes.userRouter);
  }
  private setCreatorRoutes(): void {
    const creatorRoutes = new CreatorRoutes();
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.CREATOR.BASE}`, creatorRoutes.creatorRouter);
  }

  private setUploadRouter() {
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.UPLOAD.BASE}`, new UploadRoutes().uploadRouter);
  }
  private setViewRouter() {
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.UPLOAD.BASE}`, new ViewRoutes().viewRoutes);
  }
  private setAdminRouter() {
    const adminRoutes = new AdminRoutes();
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.ADMIN.BASE}`, adminRoutes.adminRouter);
  }

  private setChatRoutes() {
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.CHAT.BASE}`, chatRouter);
  }

  private setNotificationRoutes() {
    this.app.use(`${BACKEND_ROUTES.BASE}${BACKEND_ROUTES.NOTIFICATION.BASE}`, notificationRouter);
  }

  public async listen(): Promise<void> {
    const port = process.env.PORT || 5000;
    try {
      await this.database.connect();
      subscriptionScheduler.start();
      paymentReleaseScheduler.start();

      this.server = http.createServer(this.app);
      new SocketIOHandler(this.server);

      this.server.listen(port, () =>
        logger.info("server running", port),
      );
    } catch (error) {
      logger.error("Server failed to start", { error });
    }
  }
}
(async () => {
  await redis.connect();
})();
const app = new App();
app.listen();