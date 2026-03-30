import type { Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import { MESSAGES } from "@/constants/commonMessages";
import type { IListUserPackagesUseCase } from "@/domain/interface/user/packages/IListUserPackagesUseCase";
import type { IGetPackageDetailUseCase } from "@/domain/interface/user/packages/IGetPackageDetailUseCase ";

export class UserPackageController {
  constructor(
    private _listUserPackagesUseCase: IListUserPackagesUseCase,
    private _getPackageDetailUseCase: IGetPackageDetailUseCase
  ) {}

  async listPackages(req: Request, res: Response) {
    try {
      const { category, minPrice, maxPrice, creatorId, search, sortBy, lat, lng, radiusInKm, page, limit } = req.query;

      const filters = {
        category: category as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        creatorId: creatorId as string | undefined,
        search: search as string | undefined,
        sortBy: sortBy as "price-asc" | "price-desc" | "newest" | undefined,
        lat: lat ? parseFloat(lat as string) : undefined,
        lng: lng ? parseFloat(lng as string) : undefined,
        radiusInKm: radiusInKm ? parseFloat(radiusInKm as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 6,
      };

      const packages = await this._listUserPackagesUseCase.listPackages(filters);

      res.status(StatusCode.OK).json({
        success: true,
        data: packages.data,
        total: packages.total,
        page: packages.page,
        limit: packages.limit,
        totalPages: packages.totalPages
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message
      });
    }
  }

  async getPackageDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.PACKAGE.ID_REQUIRED
        });
      }

      const packageData = await this._getPackageDetailUseCase.getPackageById(id);

      if (!packageData) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: MESSAGES.PACKAGE.NOT_FOUND
        });
      }

      res.status(StatusCode.OK).json({
        success: true,
        data: packageData
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message
      });
    }
  }
}
