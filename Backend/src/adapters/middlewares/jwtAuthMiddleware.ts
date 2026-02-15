import { NextFunction, Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AuthPayload } from "@/domain/dto/user/authPayload";
import { IJwtServices } from "@/domain/interface/service/IJwtServices";
import { ITokenBlacklistService } from "@/domain/interface/service/ITokenBlacklistService";
import { ICreatorRepository } from "@/domain/interface/creator/ICreatorRepository";
import { IUserRepository } from "@/domain/interface/user/IUserRepository";

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
export const jwtAuthMiddleware =
  (
    jwtService: IJwtServices,
    blacklistService: ITokenBlacklistService,
    userRepo: IUserRepository,
    creatorRepo: ICreatorRepository,
  ) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      const isBlacklisted = await blacklistService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ message: "Token blacklisted" });
      }

      const decoded = jwtService.verifyToken(token);
      if (decoded.role === "user") {
        const user = await userRepo.findById(decoded.userId);
        if (user && user.status === "blocked") {
          return res
            .status(StatusCode.FORBIDDEN)
            .json({
              success: false,
              message: "Your account has been blocked by the admin",
            });
        }
      }
      if (decoded.role === "creator") {
        const creator = await creatorRepo.findById(decoded.userId);
        if (creator && creator.status === "blocked") {
          return res
            .status(StatusCode.FORBIDDEN)
            .json({
              success: false,
              message: "Your account has been blocked by the admin",
            });
        }
      }
      req.user = decoded;

      next();
    } catch {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }
  };
