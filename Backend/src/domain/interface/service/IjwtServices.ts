import { AuthPayload } from "@/domain/dto/user/authPayload";

export interface IJwtServices {
  generateAccessToken(payload: AuthPayload): string;
  generateRefreshToken(payload: AuthPayload): string;
  verifyToken(token: string): AuthPayload;
  decodeToken(token: string): AuthPayload | null;
}

