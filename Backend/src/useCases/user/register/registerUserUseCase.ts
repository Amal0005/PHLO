import { RegisterDto } from "../../../domain/dto/user/registerDto";
import { IcreatorRepository } from "../../../domain/interface/creator/IcreatorRepository";
import { IMailService } from "../../../domain/interface/service/ImailServices";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IpasswordService } from "../../../domain/interface/service/IpasswordService";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IuserRegisterUseCase } from "../../../domain/interface/user/register/IuserRegisterUseCase";
import redis from "../../../framework/redis/redisClient";

import fs from "fs";
import path from "path";

export class userRegisterUseCase implements IuserRegisterUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _creatorRepo: IcreatorRepository,
    private _passwordService: IpasswordService,
    private _otpService: IOTPService,
    private _mailService: IMailService,
  ) {}

  async registerUser(user: RegisterDto): Promise<void> {
    const email = user.email.trim().toLowerCase();
    const phone = user.phone?.trim();
    const existingUser = await this._userRepo.findByEmail(email);
    if (existingUser) throw new Error("User already exists");
    const existingCreator = await this._creatorRepo.findByEmail(email);
    if (existingCreator)
      throw new Error("This email is already registered as a creator");
    const existingUserPhone = await this._userRepo.findByPhone(phone);
    if (existingUserPhone)
      throw new Error("Already Registred Number try with new");

    if (!user.password) throw new Error("Password is required");

    const hashedPassword = await this._passwordService.hash(user.password);

    const pendingUser = {
      ...user,
      email,
      password: hashedPassword,
    };

    await redis.set(`PENDING_USER_${email}`, JSON.stringify(pendingUser), {
      EX: 300,
    });
    const otp = await this._otpService.generateOtp(email);
    console.log("OTP: ", otp);

    const templatePath = path.join(
      __dirname,
      "../../../templates/user/otp.html",
    );

    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    htmlTemplate = htmlTemplate.replace("{{OTP_CODE}}", otp.toString());

    await this._mailService.sendMail(
      email,
      "Verify your account",
      htmlTemplate,
    );
  }
}
