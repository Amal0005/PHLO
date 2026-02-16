import { IEditPackageUseCase } from "@/domain/interface/creator/package/IEditPackageUseCase";
import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export class EditPackageController {
  constructor(private _editPackageUseCase: IEditPackageUseCase) { }

  async editPackage(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId;
      const { packageId } = req.params;

      if (!creatorId) {
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.ERROR.UNAUTHORIZED
        });
      }

      if (!packageId) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Package ID is required"
        });
      }

      const updatedPackage = await this._editPackageUseCase.editPackage(
        packageId,
        creatorId,
        req.body
      );

      res.status(StatusCode.OK).json({
        success: true,
        data: updatedPackage,
        message: "Package updated successfully"
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : MESSAGES.ERROR.BAD_REQUEST;

      if (message === "Package not found") {
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: message
        });
      }

      if (message.includes("Unauthorized")) {
        return res.status(StatusCode.FORBIDDEN).json({
          success: false,
          message: message
        });
      }

      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: message
      });
    }
  }
}
