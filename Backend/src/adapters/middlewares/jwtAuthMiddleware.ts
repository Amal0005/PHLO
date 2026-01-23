import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "@/domain/dto/user/authPayload";
import { IjwtServices } from "@/domain/interface/service/IjwtServices";
import { ITokenBlacklistService } from "@/domain/interface/service/ItokenBlacklistService";


export interface AuthRequest extends Request{
    user?:AuthPayload
}
export const jwtAuthMiddleware =
  (
    jwtService: IjwtServices,
    blacklistService: ITokenBlacklistService
  ) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      const isBlacklisted = await blacklistService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return res.status(401).json({ message: "Token revoked" });
      }

      const decoded = jwtService.verifyToken(token);
      req.user = decoded;

      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

