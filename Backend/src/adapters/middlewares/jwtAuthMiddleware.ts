import { NextFunction, Request, Response } from "express";
import { StatusCode } from "@/utils/statusCodes";
import { AuthPayload } from "@/domain/dto/user/authPayload";
import { IjwtServices } from "@/domain/interface/service/IjwtServices";
import { ITokenBlacklistService } from "@/domain/interface/service/ItokenBlacklistService";
import { IuserRepository } from "@/domain/interface/user/IuserRepository";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";


export interface AuthRequest extends Request {
  user?: AuthPayload
}
export const jwtAuthMiddleware =
  (
    jwtService: IjwtServices,
    blacklistService: ITokenBlacklistService,
    userRepo: IuserRepository,
    creatorRepo: IcreatorRepository
  ) =>
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const isBlacklisted = await blacklistService.isTokenBlacklisted(token);
        if (isBlacklisted) {
          return res.status(StatusCode.UNAUTHORIZED).json({ message: "Token blacklisted" });

        }

        const decoded = jwtService.verifyToken(token);
      
        const user = await userRepo.findById(decoded.userId);
        if (user && user.status === "blocked") {
          return res.status(StatusCode.FORBIDDEN).json({ success: false, message: "Your account has been blocked by the admin" });
        }
        const creator = await creatorRepo.findById(decoded.userId);
        if (creator && creator.status === "blocked") {
          return res.status(StatusCode.FORBIDDEN).json({ success: false, message: "Your account has been blocked by the admin" });
        }
        req.user = decoded;

        next();
      } catch {
        return res.status(StatusCode.UNAUTHORIZED).json({ message: "Invalid or expired token" });
      }
    };

