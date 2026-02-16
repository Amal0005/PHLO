import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { IGetPackageDetailUseCase } from "@/domain/interface/user/packages/IGetPackageDetailUseCase ";

export class GetPackageDetailController {
  constructor(
    private _getPackageDetailUseCase: IGetPackageDetailUseCase
  ) { }

  async getPackageDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Package ID is required"
        });
      }

      const packageData = await this._getPackageDetailUseCase.getPackageById(id);

      if (!packageData) {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "Package not found"
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