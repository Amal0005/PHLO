import { AppError } from "@/domain/errors/appError";
import { IEditSubscriptionUseCase } from "@/domain/interface/admin/subscription/IEditSubscriptionUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class EditSubscriptionController{
    constructor(
    private _editSubscriptionUseCase:IEditSubscriptionUseCase
    ){}
    async editSubscription(req:Request,res:Response){
        try {
            const {subscriptionId}=req.params
            console.log("iddddddd",subscriptionId)
            const result = await this._editSubscriptionUseCase.editSubscription(subscriptionId,req.body)
            console.log("Eosdfhuosdh",result)
            return res.status(StatusCode.OK).json({success:true,result})
        } catch (error:unknown) {
            const statusCode=error instanceof AppError?error.statusCode:StatusCode.BAD_REQUEST
            return res.status(statusCode).json({success :false,message:error instanceof Error?error.message:"failed to update Subscription"})
            
        }
    }
}