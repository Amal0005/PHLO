import type { IGetAllWallpapersUseCase } from "@/domain/interfaces/admin/wallpaper/IGetAllWallpapersUseCase";
import type { IBlockWallpaperUseCase } from "@/domain/interfaces/admin/wallpaper/IBlockWallpaperUseCase";
import type { IUnblockWallpaperUseCase } from "@/domain/interfaces/admin/wallpaper/IUnblockWallpaperUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { StatusCode } from "@/constants/statusCodes";
import type { WallpaperStatus } from "@/constants/wallpaperStatus";
import type { Request, Response } from "express";

export class AdminWallpaperController {
  constructor(
    private _getAllWallpapersUseCase: IGetAllWallpapersUseCase,
    private _blockWallpaperUseCase: IBlockWallpaperUseCase,
    private _unblockWallpaperUseCase: IUnblockWallpaperUseCase
  ) {}
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
  async blockWallpaper(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this._blockWallpaperUseCase.blockWallpaper(id);
      return res.status(StatusCode.OK).json({ success: true, message: "Wallpaper blocked successfully" });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async unblockWallpaper(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this._unblockWallpaperUseCase.unblockWallpaper(id);
      return res.status(StatusCode.OK).json({ success: true, message: "Wallpaper unblocked successfully" });
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
