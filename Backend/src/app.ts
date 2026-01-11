import { connectDB } from "./framework/database/connectDB/connectDB";
import express, { Express } from "express";
import http from "http";
import dotenv from "dotenv";

import redis from "./framework/redis/redisClient";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./adapters/routes/user/userRoutes";
import { CreatorRoutes } from "./adapters/routes/creator/creatorRoutes";
import { UploadRoutes } from "./adapters/routes/uploadRoutes";
import { ViewRoutes } from "./adapters/routes/viewRoutes";
import { AdminRoutes } from "./adapters/routes/admin/adminRoutes";

export class App {
  private app: Express;
  private database: connectDB;
  private server!: http.Server;
  constructor() {
    dotenv.config();
    this.app = express();
    this.database = new connectDB();
    this.setMiddlewares();
    this.setUserRoutes();
    this.setUploadRouter();
    this.setCreatorRoutes()
    this.setViewRouter()
    this.setAdminRouter()
  }
  private setMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin:process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
 this.app.use(cookieParser()); 
    this.app.use((req, res, next) => {
      next();
    });
  }
  private setUserRoutes(): void {
    this.app.use("/api", new userRoutes().userRouter);
  }
  private setCreatorRoutes():void{
        this.app.use("/api/creator", new CreatorRoutes().creatorRouter);

  }

  private setUploadRouter(){
    this.app.use("/api/upload", new UploadRoutes().uploadRouter)
  }
  private setViewRouter(){
    this.app.use("/api/upload",new ViewRoutes().viewRoutes)
  }
private setAdminRouter(){
  this.app.use("/api/admin",new AdminRoutes().adminRouter)
}

  public async listen(): Promise<void> {
    const port = process.env.PORT || 5000;
    try {
      await this.database.connect();
      this.app.listen(port, () =>
        console.log("server running", process.env.PORT)
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
