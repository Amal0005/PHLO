import { IGetApprovedWallpapersUseCase } from "@/domain/interface/user/wallpaper/IGetApprovedWallpaperUseCase";
import { MESSAGES } from "@/utils/commonMessages";
import { StatusCode } from "@/utils/statusCodes";
import { Request, Response } from "express";
import { success } from "zod";

export class UserWallpaperController {
  constructor(
    private _getApprovedWallpaperUseCase: IGetApprovedWallpapersUseCase,
  ) {}
  async getWallpaper(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;
      const result =
        await this._getApprovedWallpaperUseCase.getApprovedWallpapers(
          page,
          limit,
          search,
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
}
