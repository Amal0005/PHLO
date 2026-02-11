import { IAddCategoryUseCase } from "@/domain/interface/admin/IAddCategoryUseCase";
import { IDeleteCategoryUseCase } from "@/domain/interface/admin/IDeleteCategoryUseCase";
import { IEditCategoryUseCase } from "@/domain/interface/admin/IEditCategoryUseCase";
import { IgetCategoriesUseCase } from "@/domain/interface/admin/IGetCategoryUseCase";
import { Request, Response } from "express";

export class AdminCategoryController {
  constructor(
    private _addCategoryUseCase: IAddCategoryUseCase,
    private _getCategoryUseCase: IgetCategoriesUseCase,
    private _deleteCategoryUseCase: IDeleteCategoryUseCase,
    private _editCategoryUseCae: IEditCategoryUseCase,
  ) {}
  async addCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const category = await this._addCategoryUseCase.add(name, description);
      res.status(201).json({ success: true, category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async getCategory(req: Request, res: Response) {
    try {
      const categories = await this._getCategoryUseCase.getCategory();
      res.status(200).json({ success: true, categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async deleteCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      await this._deleteCategoryUseCase.delete(categoryId);
      res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
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
      res.status(200).json({ success: true, category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

