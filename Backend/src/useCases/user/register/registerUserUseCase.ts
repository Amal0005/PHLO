import { User } from "../../../domain/entities/userEntities";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IpasswordService } from "../../../domain/interface/service/IpasswordService";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IuserRegisterUseCase } from "../../../domain/interface/user/register/IuserRegisterUseCase";
import redis from "../../../framework/redis/redisClient";

export class userRegisterUseCase implements IuserRegisterUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _passwordService: IpasswordService,
    private _otpService:IOTPService

  ) {}

  async registerUser(user: User): Promise<void> {
        const email = user.email.trim().toLowerCase();
    const existingUser = await this._userRepo.findByEmail(email);
    if (existingUser) throw new Error("User already exists");
    if (!user.password) throw new Error("Password is required");

    const hashedPassword = await this._passwordService.hash(user.password);
    const pendingUser={
      ...user,
      email,
      password:hashedPassword
    }
    await redis.set(`PENDING_USER_${email}`, JSON.stringify(pendingUser), { EX: 300 })
   

    const otp=await this._otpService.generateOtp(email)
    console.log("OTP ",otp);
  }
  
}
