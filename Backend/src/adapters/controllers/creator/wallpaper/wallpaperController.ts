import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IAddWallpaperUseCase } from "@/domain/interface/creator/walpapper/IAddWallpaperUseCase";
import { IDeleteWallpaperUseCase } from "@/domain/interface/creator/walpapper/IDeleteWallpaperUseCase";
import { IGetCreatorWallpapersUseCase } from "@/domain/interface/creator/walpapper/IGetCreatorWallpaperUseCase";
import { MESSAGES } from "@/utils/commonMessages";
import { StatusCode } from "@/utils/statusCodes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";
import { Response } from "express";

export class WallpaperController {
  constructor(
    private _addWallpaperUseCase: IAddWallpaperUseCase,
    private _deleteWallpaperUseCase: IDeleteWallpaperUseCase,
    private getCreatorWallpapaperUseCase: IGetCreatorWallpapersUseCase,
  ) {}
  async addWallpaper(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId;
      if (!creatorId) {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
      }
      const wallpaperData = { ...req.body, creatorId };
      const result =
        await this._addWallpaperUseCase.addWallpaper(wallpaperData);
      res.status(StatusCode.CREATED).json({ success: true, data: result });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
    }
  }
  async getWallpapper(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId;
      if (!creatorId) {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as WallpaperStatus | undefined;

      const result = await this.getCreatorWallpapaperUseCase.getWallpapers(
        creatorId,
        page,
        limit,
        search,
        status
      );
      return res
        .status(StatusCode.OK)
        .json({
          success: true,
          data: result.data,
          total: result.total,
          page: result.page,
          limit: result.page,
          totalPages: result.totalPages,
        });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message });
    }
  }
  async deleteWallpaper(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId;
      const { wallpaperId } = req.params;
      console.log("A", creatorId);
      console.log("B", wallpaperId);
      if (!creatorId) {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.ERROR.UNAUTHORIZED });
      }
      if (!wallpaperId) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.WALLPAPER.ID_REQUIRED });
      }
      await this._deleteWallpaperUseCase.deleteWallpaper(
        wallpaperId,
        creatorId,
      );
      res
        .status(StatusCode.OK)
        .json({ success: true, message: MESSAGES.WALLPAPER.DELETED });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;
      if (message === MESSAGES.WALLPAPER.NOT_FOUND) {
        return res
          .status(StatusCode.NOT_FOUND)
          .json({ success: false, message });
      }
      if (message.includes("Unauthorized")) {
        return res
          .status(StatusCode.FORBIDDEN)
          .json({ success: false, message });
      }
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
    }
  }
}
