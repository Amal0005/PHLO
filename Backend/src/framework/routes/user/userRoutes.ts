import { Router } from "express";
import { registerController } from "../../depInjection/user/userInjections";

export class userRoutes {
      public userRouter: Router;

    constructor( ){
        this.userRouter=Router()
        this.setRoutes()
    }
    private setRoutes():void{
        this.userRouter.post("/register",(req,res)=>{
            registerController.register(req,res)
        })
    }
}