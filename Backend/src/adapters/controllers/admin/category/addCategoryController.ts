import { IAddCategoryUseCase } from "@/domain/interface/admin/IAddCategoryUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AppError } from "@/domain/errors/appError";

interface AddCategoryRequestBody {
  name: string;
  description?: string;
}

export class AddCategoryController {
  constructor(private _addCategoryUseCase: IAddCategoryUseCase) {}

  async addCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body as AddCategoryRequestBody;
      const category = await this._addCategoryUseCase.add(name, description);
      return res.status(StatusCode.CREATED).json({ success: true, category });
    } catch (error: unknown) {
      const statusCode =
        error instanceof AppError ? error.statusCode : StatusCode.BAD_REQUEST;
      return res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to add category",
      });
    }
  }
}
