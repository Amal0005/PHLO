import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { IjwtServices } from "../../interface/service/IjwtServices";
import { AuthPayload } from "../../dto/user/auth/authPayload";

export class JwtServices implements IjwtServices {
  private getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");
    return secret;
  }

  generateAccessToken(payload: AuthPayload): string {
    const secret = this.getSecret();
    const expiresIn = Number(process.env.JWT_ACCESS_EXPIRE);
    return jwt.sign(payload, secret, {
      expiresIn: isNaN(expiresIn) ? "15m" : expiresIn,
    });
  }

  generateRefreshToken(payload: AuthPayload): string {
    const secret = this.getSecret();
    const expiresIn = Number(process.env.JWT_REFRESH_EXPIRES);
    return jwt.sign(payload, secret, { expiresIn });
  }

verifyToken(token: string): AuthPayload {
  const secret = this.getSecret();
  return jwt.verify(token, secret) as AuthPayload;
}
}
