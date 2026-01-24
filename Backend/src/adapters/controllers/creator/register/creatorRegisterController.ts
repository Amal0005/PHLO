import { Request,Response } from "express";
import { IregisterCreatorUseCase } from "@/domain/interface/creator/register/IregisterCreatorUseCase";
export class CreatorRegisterController{
    constructor(
        private _registerCreaterUseCase:IregisterCreatorUseCase
    ){}
    async register(req:Request,res:Response){
        try {
            const creator= await this._registerCreaterUseCase.registerCreator(req.body)
            res.status(201).json({success:true,creator})
        } catch (error:any) {
      res.status(400).json({ success: false, message: error.message });
        }
    }
async checkExists(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const exists = await this._registerCreaterUseCase.checkExists(email);

    return res.status(200).json({ exists });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

}