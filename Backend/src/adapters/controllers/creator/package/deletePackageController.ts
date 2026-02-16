import { IDeletePackageUseCase } from "@/domain/interface/creator/package/IDeletePackageUseCase";
import { Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export class DeletePackageController {
  constructor(private _deletePackageUseCase: IDeletePackageUseCase) { }

  async deletePackage(req: AuthRequest, res: Response) {
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

      await this._deletePackageUseCase.deletePackage(packageId, creatorId);

      res.status(StatusCode.OK).json({
        success: true,
        message: "Package deleted successfully"
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
