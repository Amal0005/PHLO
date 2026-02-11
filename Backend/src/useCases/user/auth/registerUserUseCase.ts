import { RegisterDto } from "../../../domain/dto/user/registerDto";
import { ICreatorRepository } from "../../../domain/interface/creator/ICreatorRepository";
import { IMailService } from "../../../domain/interface/service/IMailServices";
import { IOTPService } from "../../../domain/interface/service/IOtpServices";
import { IPasswordService } from "../../../domain/interface/service/IPasswordService";
import { IUserRepository } from "../../../domain/interface/user/IUserRepository";
import { IUserRegisterUseCase } from "../../../domain/interface/user/auth/IUserRegisterUseCase";
import { IRedisService } from "../../../domain/interface/service/IRedisServices";

import { renderTemplate } from "../../../utils/renderTemplates";

export class userRegisterUseCase implements IUserRegisterUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _creatorRepo: ICreatorRepository,
    private _passwordService: IPasswordService,
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

