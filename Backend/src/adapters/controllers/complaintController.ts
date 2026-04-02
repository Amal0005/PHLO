import type { IGetAllComplaintsUseCase } from "@/domain/interfaces/admin/complaint/IGetAllComplaintsUseCase";
import type { IRejectComplaintUseCase } from "@/domain/interfaces/admin/complaint/IRejectComplaintUseCase";
import type { IResolveComplaintUseCase } from "@/domain/interfaces/admin/complaint/IResolveComplaintUseCase";
import type { IGetComplaintByBookingUseCase } from "@/domain/interfaces/user/complaint/IGetComplaintByBookingUseCase";
import type { IRegisterComplaintUseCase } from "@/domain/interfaces/user/complaint/IRegisterComplaintUseCase";
import type { Request, Response } from "express";
import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { StatusCode } from "@/constants/statusCodes";


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
      res.status(StatusCode.CREATED).json(complaint);
    } catch (err: unknown) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: (err as Error).message });
    }
  }

  async getByBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const complaint = await this.getByBookingUseCase.getComplaint(bookingId);
      res.status(StatusCode.OK).json(complaint);
    } catch (err: unknown) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: (err as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const search = req.query.search as string;
      const status = req.query.status as string;
      const data = await this.getAllUseCase.getAllComplaint(page, limit, search, status);
      res.status(StatusCode.OK).json({ success: true, ...data });
    } catch (err: unknown) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: (err as Error).message });
    }
  }

  async resolve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action, adminComment } = req.body;
      const result = await this.resolveUseCase.resolveComplaint(id, action, adminComment);
      res.status(StatusCode.OK).json(result);
    } catch (err: unknown) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: (err as Error).message });
    }
  }

  async reject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { adminComment } = req.body;
      const result = await this.rejectUseCase.rejectComplaint(id, adminComment);
      res.status(StatusCode.OK).json(result);
    } catch (err: unknown) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: (err as Error).message });
    }
  }
}

