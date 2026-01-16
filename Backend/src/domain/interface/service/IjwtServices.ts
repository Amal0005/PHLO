import { AuthPayload } from "../../dto/user/authPayload";

export interface IjwtServices {
  generateAccessToken(payload: AuthPayload): string;
  generateRefreshToken(payload: AuthPayload): string;
  verifyToken(token: string): AuthPayload;
  decodeToken(token: string): AuthPayload | null;
}
