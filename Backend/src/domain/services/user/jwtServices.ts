import jwt from "jsonwebtoken";
import { IjwtServices } from "../../interface/service/IjwtServices";

export class JwtServices implements IjwtServices {
  sign(payload: object): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing");

    const expiresIn =
      process.env.JWT_EXPIRES
        ? Number(process.env.JWT_EXPIRES)
        : 60 * 60 * 24 * 7;

    return jwt.sign(payload, secret as jwt.Secret, { expiresIn });
  }
}
