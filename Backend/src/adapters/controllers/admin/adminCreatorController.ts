import { Request, Response } from "express";
import { IapproveRejectCreatorUseCase } from "../../../domain/interface/admin/IapproveRejectCreatorUseCase";

export class AdminCreatorController{
    constructor(
        private _approveRejectCreatorUseCase:IapproveRejectCreatorUseCase
    ){}
    async approve(req: Request, res: Response){
        try {
            await this._approveRejectCreatorUseCase.approveCreator(req.params.id)
               return res.status(200).json({
        success: true,
        message: "Creator approved",
      });
        } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    }
    async reject(req: Request, res: Response){
        try {
            await this._approveRejectCreatorUseCase.rejectCreator(req.params.id)
               return res.status(200).json({
        success: true,
        message: "Creator rejected",
      });
        } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    }
}