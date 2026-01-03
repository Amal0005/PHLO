import { connectDB } from "./framework/database/connectDB/connectDB";
import express, { Express } from "express";
import http from "http";
import dotenv from "dotenv";
import { userRoutes } from "./framework/routes/user/userRoutes";
import redis from "./framework/redis/redisClient";
import cors from "cors";

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
  }
  private setMiddlewares(): void {
    this.app.use(express.json());

    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    this.app.use((req, res, next) => {
      console.log(req.method, req.url);
      next();
    });
  }
  private setUserRoutes(): void {
    this.app.use("/api", new userRoutes().userRouter);
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
