import { JwtPayload } from "jsonwebtoken";
import { AuthPayload } from "../../dto/user/auth/authPayload";

export interface IjwtServices {
generateAccessToken(payload: AuthPayload): string
generateRefreshToken(payload: AuthPayload): string
  verifyToken(token: string): AuthPayload;
}
