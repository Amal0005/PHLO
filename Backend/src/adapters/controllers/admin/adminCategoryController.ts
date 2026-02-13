import { IAddCategoryUseCase } from "@/domain/interface/admin/IAddCategoryUseCase";
import { IDeleteCategoryUseCase } from "@/domain/interface/admin/IDeleteCategoryUseCase";
import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";
import { IgetCategoriesUseCase } from "@/domain/interface/admin/IGetCategoryUseCase";
import { Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";

export class AdminCategoryController {
  constructor(
    private _addCategoryUseCase: IAddCategoryUseCase,
    private _getCategoryUseCase: IgetCategoriesUseCase,
    private _deleteCategoryUseCase: IDeleteCategoryUseCase,
    private _editCategoryUseCae: IEditCategoryUseCase,
  ) { }
  async addCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const category = await this._addCategoryUseCase.add(name, description);
      res.status(StatusCode.CREATED).json({ success: true, category });
    } catch (error: any) {
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }
  async getCategory(req: Request, res: Response) {
    try {
      const categories = await this._getCategoryUseCase.getCategory();
      res.status(StatusCode.OK).json({ success: true, categories });
    } catch (error: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }
  async deleteCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      await this._deleteCategoryUseCase.delete(categoryId);
      res
        .status(StatusCode.OK)
        .json({ success: true, message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }
  async editCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const { name, description } = req.body;
      const category = await this._editCategoryUseCae.edit(
        categoryId,
        name,
        description,
      );
      res.status(StatusCode.OK).json({ success: true, category });
    } catch (error: any) {
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }
}

