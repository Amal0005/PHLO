import { AppError } from "@/domain/errors/appError";
import { IApproveWallpaperUseCase } from "@/domain/interface/admin/wallpaper/IApproveWallpaperUseCase";
import { IGetAllWallpapersUseCase } from "@/domain/interface/admin/wallpaper/IGetAllWallpapersUseCase";
import { IRejectWallpaperUseCase } from "@/domain/interface/admin/wallpaper/IRejectWallpaperUseCase";
import { MESSAGES } from "@/utils/commonMessages";
import { StatusCode } from "@/utils/statusCodes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";
import { Request, Response } from "express";

export class AdminWallpaperController {
  constructor(
    private _approveWallpaperUseCase: IApproveWallpaperUseCase,
    private _rejectWallpaperUseCase: IRejectWallpaperUseCase,
    private _getAllWallpapersUseCase: IGetAllWallpapersUseCase,
  ) { }
  async getWallpaper(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as WallpaperStatus | undefined;
      const search = req.query.search as string | undefined;

      const data = await this._getAllWallpapersUseCase.getAllWallpapers(
        page,
        limit,
        status,
        search,
      );
      return res.status(StatusCode.OK).json({ success: true, ...data });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async approveWallpaper(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.WALLPAPER.ID_REQUIRED });
      }
      await this._approveWallpaperUseCase.approveWallpaper(id);
      return res
        .status(StatusCode.OK)
        .json({ success: true, message: MESSAGES.WALLPAPER.APPROVED });
    } catch (error: unknown) {
      const statusCode =
        error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      return res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : MESSAGES.WALLPAPER.APPROVE_ERROR,
      });
    }
  }
  async rejectWallpaper(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      if (!id) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.WALLPAPER.ID_REQUIRED });
      }
      if (!reason?.trim()) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.WALLPAPER.REJECTION_REASON_REQUIRED,
        });
      }
      await this._rejectWallpaperUseCase.rejectWallpaper(id, reason);
      return res
        .status(StatusCode.OK)
        .json({ success: true, message: MESSAGES.WALLPAPER.REJECTED });
    } catch (error) {
      const statusCode =
        error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      return res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : MESSAGES.WALLPAPER.REJECT_ERROR,
      });
    }
  }
}
