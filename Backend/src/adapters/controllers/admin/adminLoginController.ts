import { Request, Response } from "express";
import { IadminLoginUseCase } from "../../../domain/interface/admin/IadminLoginUseCase";

export class AdminLoginController{
    constructor(
        private adminLoginUseCase:IadminLoginUseCase
    ){}
    async login(req:Request,res:Response){
        try {
            const {email,password}=req.body
            const result=await this.adminLoginUseCase.login(email,password)
              return res.status(200).json({
        success: true,
        message: "Admin login successful",
        data: result,
      });
        } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    }
}