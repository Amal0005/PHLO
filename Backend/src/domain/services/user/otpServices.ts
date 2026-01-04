import redis from "../../../framework/redis/redisClient";
import { IOTPService } from "../../interface/service/IotpServices";

export class OtpServices implements IOTPService{
  async generateOtp(identifier: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await this.saveOtp(identifier,otp)
    return otp
  }
  async saveOtp(identifier: string, otp: string): Promise<void> {
    await redis.set(`OTP_${identifier}`, otp, { EX: 120 });

  }
  async verifyOtp(identifier: string, otp: string): Promise<"VERIFIED" | "INVALID" | "EXPIRED"> {
    const stored=await redis.get(`OTP_${identifier}`)
    if(!stored)return "EXPIRED"
    if(stored!==otp)return "INVALID"
    await redis.del(`OTP_${identifier}`)
    return "VERIFIED"
  }
}