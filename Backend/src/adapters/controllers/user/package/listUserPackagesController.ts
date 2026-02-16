import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { IListUserPackagesUseCase } from "@/domain/interface/user/packages/IListUserPackagesUseCase";

export class ListUserPackagesController {
  constructor(
    private _listUserPackagesUseCase: IListUserPackagesUseCase
  ) { }

  async listPackages(req: Request, res: Response) {
    try {
      const { category, minPrice, maxPrice, creatorId, search, sortBy, lat, lng, radiusInKm } = req.query;

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
      };

      const packages = await this._listUserPackagesUseCase.listPackages(filters);

      res.status(StatusCode.OK).json({
        success: true,
        data: packages,
        count: packages.length
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
