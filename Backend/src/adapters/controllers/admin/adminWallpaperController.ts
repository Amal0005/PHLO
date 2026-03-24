import { IGetAllWallpapersUseCase } from "@/domain/interface/admin/wallpaper/IGetAllWallpapersUseCase";
import { MESSAGES } from "@/constants/commonMessages";
import { StatusCode } from "@/constants/statusCodes";
import { WallpaperStatus } from "@/constants/wallpaperStatus";
import { Request, Response } from "express";

export class AdminWallpaperController {
  constructor(
    private _getAllWallpapersUseCase: IGetAllWallpapersUseCase,
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

}
