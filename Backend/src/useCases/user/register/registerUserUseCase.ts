import { RegisterDto } from "../../../domain/dto/user/auth/registerDto";
import { UserDto } from "../../../domain/dto/user/userDto";
import { User } from "../../../domain/entities/userEntities";
import { IMailService } from "../../../domain/interface/service/ImailServices";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IpasswordService } from "../../../domain/interface/service/IpasswordService";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IuserRegisterUseCase } from "../../../domain/interface/user/register/IuserRegisterUseCase";
import redis from "../../../framework/redis/redisClient";

export class userRegisterUseCase implements IuserRegisterUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _passwordService: IpasswordService,
    private _otpService:IOTPService,
    private _mailService:IMailService

  ) {}

  async registerUser(user: RegisterDto): Promise<void> {
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
    await this._mailService.sendMail(
      email,
          "Verify your account",
    `
      <h2>Welcome to Our App</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `
    )
  }
  
}
