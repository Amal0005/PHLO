import { IuserRegisterUseCase } from "../../../../domain/interface/user/register/IuserRegisterUseCase";
import { Request,Response } from "express";

export class userRegisterController{
    constructor(
        private _userRegisterUseCase:IuserRegisterUseCase
    
    ){}
    async register(req:Request,res:Response){
        // const {email,name,password}=req.body
        try{
console.log(req.body)
            const userInput=req.body
            console.log(userInput);
            const result=await this._userRegisterUseCase.registerUser(userInput)
            res.status(200).json({
                message:"User register successfully",result
            })
        }catch(error){
            res.status(500).json({message:"Error occured when Register",error})
        }

    }
}