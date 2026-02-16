import jwt from "jsonwebtoken";
import { IJwtServices } from "../../interface/service/IJwtServices";
import { AuthPayload } from "../../dto/user/authPayload";

export class JwtServices implements IJwtServices {
  private getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");
    return secret;
  }

  generateAccessToken(payload: AuthPayload): string {
    const secret = this.getSecret();
    const expiresIn = Number(process.env.JWT_ACCESS_EXPIRES);
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
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      !("userId" in decoded) ||
      !("role" in decoded) ||
      !("email" in decoded)
    ) {
      throw new Error("Invalid token payload");
    }

    return decoded as AuthPayload;
  }

  decodeToken(token: string): AuthPayload | null {
    try {
      return jwt.decode(token) as AuthPayload;
    } catch {
      return null;
    }
  }
}

