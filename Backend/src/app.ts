import { connectDB } from "./framework/database/connectDB/connectDB"
import express,{ Express } from "express"
import http from "http"
import dotenv from "dotenv"
import { userRoutes } from "./framework/routes/user/userRoutes"

export class App{
    private app:Express
    private database:connectDB
    private server!:http.Server
    constructor(){
        dotenv.config()
        this.app=express()
        this.database=new connectDB()

            this.setMiddlewares();

        this.setUserRoutes()
    }
      private setMiddlewares(): void {
    this.app.use(express.json());
      }
    private setUserRoutes():void{
        this.app.use("/api", new userRoutes().userRouter)
    }
    public async listen():Promise<void>{
        const port=process.env.PORT
        try {
            await this.database.connect()
            this.app.listen(port,()=>console.log("server running")
            )
        } catch (error) {
            console.error(error);
            
        }
    }
}
const app=new App()
app.listen()
