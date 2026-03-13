import { IGetAllComplaintsUseCase } from "@/domain/interface/admin/complaint/IGetAllComplaintsUseCase";
import { IRejectComplaintUseCase } from "@/domain/interface/admin/complaint/IRejectComplaintUseCase";
import { IResolveComplaintUseCase } from "@/domain/interface/admin/complaint/IResolveComplaintUseCase";
import { IGetComplaintByBookingUseCase } from "@/application/useCases/user/complaint/getComplaintByBookingUseCase";
import { IRegisterComplaintUseCase } from "@/domain/interface/user/complaint/IRegisterComplaintUseCase";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

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
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async getByBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const complaint = await this.getByBookingUseCase.execute(bookingId);
      res.status(200).json(complaint);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
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

  async reject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminComment } = req.body;
      const result = await this.rejectUseCase.rejectComplaint(id, adminComment);
      res.status(200).json(result);
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
}
