import { IRecordDownloadUseCase } from "@/domain/interface/creator/walpapper/IRecordDownloadUseCase";
import { IGetApprovedWallpapersUseCase } from "@/domain/interface/user/wallpaper/IGetApprovedWallpaperUseCase";
import { MESSAGES } from "@/utils/commonMessages";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";

export class UserWallpaperController {
  constructor(
    private _getApprovedWallpaperUseCase: IGetApprovedWallpapersUseCase,
    private _recordDownloadUseCase: IRecordDownloadUseCase
  ) {}
  async getWallpaper(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;
      const hashtag = req.query.hashtag as string;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const result =
        await this._getApprovedWallpaperUseCase.getApprovedWallpapers(
          page,
          limit,
          search,
          hashtag,
          !isNaN(minPrice!) ? minPrice : undefined,
          !isNaN(maxPrice!) ? maxPrice : undefined,
        );
      return res.status(StatusCode.OK).json({
        success: true,
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error: unknown) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async recordDownload(req: Request, res: Response) {
    try {
      const wallpaperId = req.params.id;
      const userId = (req as any).user?.id;
      console.log(userId)
      const { creatorId } = req.body;
      if (!wallpaperId) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Wallpaper ID is required",
        });
      }
      if (!userId) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User must be logged in",
        });
      }
      if (!creatorId) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Creator ID is required",
        });
      }
      const result = await this._recordDownloadUseCase.record(
        wallpaperId,
        userId,
        creatorId,
      );
      return res.status(StatusCode.OK).json({
        success: true,
        downloadCount: result.downloadCount,
      });
    } catch (error: unknown) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
