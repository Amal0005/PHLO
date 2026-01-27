import { Request, Response } from "express";
import { IcreatorLoginUseCase } from "@/domain/interface/creator/login/IcreatorLoginUseCase";
import { AuthError } from "@/domain/errors/authError";

export class CreatorLoginController{
    constructor(
        private _loginUseCase:IcreatorLoginUseCase
    ){}
    async login(req:Request,res:Response){
        try {
            const {email ,password}=req.body as {
                email:string,
                password:string
            }
            const result=await this._loginUseCase.login(email,password)
                return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
        
      });
        }  catch (error) {

    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...error.payload,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
}