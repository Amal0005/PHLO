import type { NextFunction, Request, Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import type { AuthPayload } from "@/domain/dto/user/authPayload";
import type { IJwtServices } from "@/domain/interface/service/IJwtServices";
import type { ITokenBlacklistService } from "@/domain/interface/service/ITokenBlacklistService";
import { MESSAGES } from "@/constants/commonMessages";
import type { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import type { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";

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
            .json({ message: MESSAGES.AUTH.UNAUTHORIZED });
        }

        const token = authHeader.split(" ")[1];
        console.log(token)
        const isBlacklisted = await blacklistService.isTokenBlacklisted(token);
        if (isBlacklisted) {
          return res
            .status(StatusCode.UNAUTHORIZED)
            .json({ message: MESSAGES.AUTH.TOKEN_BLACKLISTED });
        }

        const decoded = jwtService.verifyToken(token);
        if (decoded.role === "user") {
          const user = await userRepo.findById(decoded.userId);
          if (user && user.status === "blocked") {
            return res
              .status(StatusCode.FORBIDDEN)
              .json({
                success: false,
                message: MESSAGES.AUTH.ACCOUNT_BLOCKED_BY_ADMIN,
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
                message: MESSAGES.AUTH.ACCOUNT_BLOCKED_BY_ADMIN,
              });
          }
        }
        req.user = decoded;

        next();
      } catch {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .json({ message: MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN });
      }
    };

