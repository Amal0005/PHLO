import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IAddWallpaperUseCase } from "@/domain/interface/creator/walpapper/IAddWallpaperUseCase";
import { MESSAGES } from "@/utils/commonMessages";
import { StatusCode } from "@/utils/statusCodes";
import {  Response } from "express";

export class WallpaperController {
    constructor(
        private _addWallpaperUseCase : IAddWallpaperUseCase
    ){}
    async addWallpaper(req:AuthRequest,res:Response){
        try {
            const creatorId=req.user?.userId
            if(!creatorId){
                return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
            }
            const wallpaperData={...req.body,creatorId}
            const result=await this._addWallpaperUseCase.addWallpaper(wallpaperData)
                  res.status(StatusCode.CREATED).json({ success: true, data: result });

        }  catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
    }
    }
}