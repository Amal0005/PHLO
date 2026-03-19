import { IGetAllComplaintsUseCase } from "@/domain/interface/admin/complaint/IGetAllComplaintsUseCase";
import { IRejectComplaintUseCase } from "@/domain/interface/admin/complaint/IRejectComplaintUseCase";
import { IResolveComplaintUseCase } from "@/domain/interface/admin/complaint/IResolveComplaintUseCase";
import { IGetComplaintByBookingUseCase } from "@/domain/interface/user/complaint/IGetComplaintByBookingUseCase";
import { IRegisterComplaintUseCase } from "@/domain/interface/user/complaint/IRegisterComplaintUseCase";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/jwtAuthMiddleware";


export class ComplaintController {
  constructor(
    private registerUseCase: IRegisterComplaintUseCase,
    private getAllUseCase: IGetAllComplaintsUseCase,
    private resolveUseCase: IResolveComplaintUseCase,
    private rejectUseCase: IRejectComplaintUseCase,
    private getByBookingUseCase: IGetComplaintByBookingUseCase
  ) {}

  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || "";
      const complaint = await this.registerUseCase.registerComplaint(userId, req.body);
      res.status(201).json(complaint);
    } catch (_err: unknown) {
      res.status(500).json({ error: (_err as Error).message });
    }
  }

  async getByBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const complaint = await this.getByBookingUseCase.getComplaint(bookingId);
      res.status(200).json(complaint);
    } catch (_err: unknown) {
      res.status(500).json({ error: (_err as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const search = req.query.search as string;
      const status = req.query.status as string;
      const data = await this.getAllUseCase.getAllComplaint(page, limit, search, status);
      res.status(200).json({ success: true, ...data });
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  async resolve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action, adminComment } = req.body;
      const result = await this.resolveUseCase.resolveComplaint(id, action, adminComment);
      res.status(200).json(result);
    } catch (_err: unknown) {
      res.status(500).json({ error: (_err as Error).message });
    }
  }

  async reject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminComment } = req.body;
      const result = await this.rejectUseCase.rejectComplaint(id, adminComment);
      res.status(200).json(result);
    } catch (_err: unknown) {
      res.status(500).json({ error: (_err as Error).message });
    }
  }
}
