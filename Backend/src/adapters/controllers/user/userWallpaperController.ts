import { IRecordDownloadUseCase } from "@/domain/interface/creator/walpapper/IRecordDownloadUseCase";
import { IGetApprovedWallpapersUseCase } from "@/domain/interface/user/wallpaper/IGetApprovedWallpaperUseCase";
import { IBuyWallpaperUseCase } from "@/domain/interface/user/wallpaper/IBuyWallpaperUseCase";
import { MESSAGES } from "@/utils/commonMessages";
import { StatusCode } from "@/utils/statusCodes";
import { Response } from "express";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export class UserWallpaperController {
  constructor(
    private _getApprovedWallpaperUseCase: IGetApprovedWallpapersUseCase,
    private _recordDownloadUseCase: IRecordDownloadUseCase,
    private _buyWallpaperUseCase: IBuyWallpaperUseCase
  ) {}

  async getWallpaper(req: AuthRequest, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;
      const hashtag = req.query.hashtag as string;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const userId = req.user?.userId;

      const result = await this._getApprovedWallpaperUseCase.getApprovedWallpapers(
        page,
        limit,
        search,
        hashtag,
        !isNaN(minPrice!) ? minPrice : undefined,
        !isNaN(maxPrice!) ? maxPrice : undefined,
        userId
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
        message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async buyWallpaper(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const { successUrl, cancelUrl } = req.body;

      if (!userId) {
        return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.USER.MUST_BE_LOGGED_IN });
      }

      const session = await this._buyWallpaperUseCase.buyWallpaper(id, userId, successUrl, cancelUrl);
      return res.status(StatusCode.OK).json({ success: true, ...session });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
      return res.status(StatusCode.BAD_REQUEST).json({ success: false, message });
    }
  }

  async recordDownload(req: AuthRequest, res: Response) {
    try {
      const wallpaperId = req.params.id;
      const userId = req.user?.userId;
      const { creatorId } = req.body;

      if (!wallpaperId) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.WALLPAPER.ID_REQUIRED,
        });
      }

      if (!userId) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.USER.MUST_BE_LOGGED_IN,
        });
      }

      if (!creatorId) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.WALLPAPER.CREATOR_ID_REQUIRED,
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
        message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
