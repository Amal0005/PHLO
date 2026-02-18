import { IRedisService } from "../../interface/service/IRedisServices";
import { IOTPService } from "../../interface/service/IOtpServices";

export class OtpServices implements IOTPService {
  constructor(private _redisService: IRedisService) {}
  async generateOtp(identifier: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await this.saveOtp(identifier, otp)
    return otp
  }
  async saveOtp(identifier: string, otp: string): Promise<void> {
    
    await this._redisService.setValue(`OTP_${identifier}`, otp, 60);

  }
  async verifyOtp(identifier: string, otp: string): Promise<"VERIFIED" | "INVALID" | "EXPIRED"> {
    const stored = await this._redisService.getValue(`OTP_${identifier}`)
    if (!stored) return "EXPIRED"
    if (stored !== otp) return "INVALID"
    await this._redisService.deleteValue(`OTP_${identifier}`)
    return "VERIFIED"
  }
}
