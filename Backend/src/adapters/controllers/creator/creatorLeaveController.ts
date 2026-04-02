import type { Response } from "express";
import type { IAddLeaveUseCase } from "@/domain/interfaces/creator/leave/IAddLeaveUseCase";
import type { IRemoveLeaveUseCase } from "@/domain/interfaces/creator/leave/IRemoveLeaveUseCase";
import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import type { IGetLeavesUseCase } from "@/domain/interfaces/creator/leave/IGetLeaveUseCase";
import { StatusCode } from "@/constants/statusCodes";

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
      res.status(StatusCode.OK).json(leaves);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    }
  }

  async addLeave(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId as string;
      const { date } = req.body;
      const result = await this.addLeaveUseCase.addLeave({ creatorId, date });
      res.status(StatusCode.CREATED).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
      }
    }
  }

  async removeLeave(req: AuthRequest, res: Response) {
    try {
      const creatorId = req.user?.userId as string;
      const { date } = req.params;
      await this.removeLeaveUseCase.removeLeave(creatorId, new Date(date));
      res.status(StatusCode.OK).json({ message: "Leave removed successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
      }
    }
  }
}

