import { IGetSubscriptionUseCase } from "@/domain/interface/admin/IGetSubscriptionUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class GetSubscriptionController{
    constructor(
        private _getSubscriptionUseCase:IGetSubscriptionUseCase
    ){}
    async getSubscriptions(req:Request,res:Response){
        try {
            const result=await this._getSubscriptionUseCase.getSubscription()
            return res.status(StatusCode.OK).json({success :true,message:"Subscriptions listed",result})
        } catch (error) {
            console.log(error)
            throw new Error("failed to fetch subscriptions")
        }
    }
}