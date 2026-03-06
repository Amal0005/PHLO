import { Response } from "express";
import { IAddLeaveUseCase } from "@/domain/interface/creator/leave/IAddLeaveUseCase";
import { IRemoveLeaveUseCase } from "@/domain/interface/creator/leave/IRemoveLeaveUseCase";
import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IGetLeavesUseCase } from "@/domain/interface/creator/leave/IGetLeaveUseCase";

export class CreatorLeaveController {
  constructor(
    private getLeavesUseCase: IGetLeavesUseCase,
    private addLeaveUseCase: IAddLeaveUseCase,
    private removeLeaveUseCase: IRemoveLeaveUseCase
  ) {}

  async getLeaves(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId as string;
      const leaves = await this.getLeavesUseCase.getLeave(creatorId);
      res.status(200).json(leaves);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async addLeave(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId as string;
      const { date } = req.body;
      const result = await this.addLeaveUseCase.addLeave({ creatorId, date });
      res.status(201).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async removeLeave(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId as string;
      const { date } = req.params;
      await this.removeLeaveUseCase.removeLeave(creatorId, new Date(date));
      res.status(200).json({ message: "Leave removed successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
