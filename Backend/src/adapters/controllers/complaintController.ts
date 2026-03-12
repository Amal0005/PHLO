import { IGetAllComplaintsUseCase } from "@/domain/interface/admin/complaint/IGetAllComplaintsUseCase";
import { IResolveComplaintUseCase } from "@/domain/interface/admin/complaint/IResolveComplaintUseCase";
import { IRegisterComplaintUseCase } from "@/domain/interface/user/complaint/IRegisterComplaintUseCase";
import { Request, Response } from "express";

export class ComplaintController {
  constructor(
    private registerUseCase: IRegisterComplaintUseCase,
    private getAllUseCase: IGetAllComplaintsUseCase,
    private resolveUseCase: IResolveComplaintUseCase
  ) { }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const complaint = await this.registerUseCase.registerComplaint(userId, req.body);
      res.status(201).json(complaint);
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to register complaint" });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const complaints = await this.getAllUseCase.getAllComplaint();
      res.status(200).json(complaints);
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to fetch complaints" });
    }
  }

  async resolve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action, adminComment } = req.body;
      const result = await this.resolveUseCase.resolveComplaint(id, action, adminComment);
      res.status(200).json(result);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
}
