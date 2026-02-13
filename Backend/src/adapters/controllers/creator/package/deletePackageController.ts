import { IDeletePackageUseCase } from "@/domain/interface/creator/package/IDeletePackageUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { MESSAGES } from "@/utils/commonMessages";

export class DeletePackageController {
  constructor(private _deletePackageUseCase: IDeletePackageUseCase) {}

  async deletePackage(req: Request, res: Response) {
    try {
      const creatorId = (req as any).user?.userId;
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
    } catch (error: any) {
      if (error.message === "Package not found") {
        return res.status(StatusCode.NOT_FOUND).json({ 
          success: false, 
          message: error.message 
        });
      }
      
      if (error.message.includes("Unauthorized")) {
        return res.status(StatusCode.FORBIDDEN).json({ 
          success: false, 
          message: error.message 
        });
      }

      res.status(StatusCode.BAD_REQUEST).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}
