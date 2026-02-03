import { RegisterDto } from "../../../domain/dto/user/registerDto";
import { IcreatorRepository } from "../../../domain/interface/creator/IcreatorRepository";
import { IMailService } from "../../../domain/interface/service/ImailServices";
import { IOTPService } from "../../../domain/interface/service/IotpServices";
import { IpasswordService } from "../../../domain/interface/service/IpasswordService";
import { IuserRepository } from "../../../domain/interface/user/IuserRepository";
import { IuserRegisterUseCase } from "../../../domain/interface/user/register/IuserRegisterUseCase";
import { IRedisService } from "../../../domain/interface/service/IredisServices";

import { renderTemplate } from "../../../utils/renderTemplates";

export class userRegisterUseCase implements IuserRegisterUseCase {
  constructor(
    private _userRepo: IuserRepository,
    private _creatorRepo: IcreatorRepository,
    private _passwordService: IpasswordService,
    private _otpService: IOTPService,
    private _mailService: IMailService,
    private _redisService: IRedisService,
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
      throw new Error(
        "Phone number already registered. Please try with a different one",
      );

    if (!user.password) throw new Error("Password is required");

    const hashedPassword = await this._passwordService.hash(user.password);

    const pendingUser = {
      ...user,
      email,
      password: hashedPassword,
    };

    await this._redisService.setValue(
      `PENDING_USER_${email}`,
      JSON.stringify(pendingUser),
      300,
    );
    const otp = await this._otpService.generateOtp(email);
    console.log("OTP: ", otp);

    const htmlTemplate = renderTemplate("user/otp.html", {
      TITLE: "Verify Your Email",
      MESSAGE: "Enter the verification code to complete your registration",
      OTP_CODE: otp.toString(),
    });

    await this._mailService.sendMail(
      email,
      "Verify your account",
      htmlTemplate,
    );
  }
}
