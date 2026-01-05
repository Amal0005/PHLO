import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { IjwtServices } from "../../interface/service/IjwtServices";

export class JwtServices implements IjwtServices {
  private getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");
    return secret;
  }

  generateAccessToken(payload: object): string {
    const secret = this.getSecret();
    const expiresIn = Number(process.env.JWT_ACCESS_EXPIRE);
    return jwt.sign(payload, secret, {
      expiresIn: isNaN(expiresIn) ? "15m" : expiresIn,
    });
  }

  generateRefreshToken(payload: object): string {
    const secret = this.getSecret();
    const expiresIn = Number(process.env.JWT_REFRESH_EXPIRES);
    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyToken(token: string): string | JwtPayload {
    const secret = this.getSecret();
    return jwt.verify(token, secret);
  }
}
