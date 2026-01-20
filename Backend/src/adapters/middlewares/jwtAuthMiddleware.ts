import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../../domain/dto/user/authPayload";
import { IjwtServices } from "../../domain/interface/service/IjwtServices";

export interface AuthRequest extends Request{
    user?:AuthPayload
}
export const jwtAuthMiddleware=(jwtService:IjwtServices)=>(
    req:AuthRequest,
    res:Response,
    next:NextFunction
)=>{
    try {
        const authHeader=req.headers.authorization
        if(!authHeader||authHeader.startsWith("Bearer")){
            return res.status(401).json({message:"Unauthorized"})
        }
        const token=authHeader.split(" ")[1]
        const secret=process.env.JWT_SECRET

        const decoded=jwtService.verifyToken(token)as  AuthPayload
        
        req.user=decoded
        next()
    } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });

    }
}