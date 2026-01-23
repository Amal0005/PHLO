import { Router,Request,Response } from "express";
import { viewController } from "@/framework/depInjection/s3Injections";

export class ViewRoutes{
    public viewRoutes:Router
    constructor(){
         this.viewRoutes = Router();
    this.setRoutes();
    }
    private setRoutes():void{
        this.viewRoutes.get("/view",(req:Request,res:Response)=>{
            viewController.getImage(req,res)
        })
    }
}