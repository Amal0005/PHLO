import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IRegisterCreatorUseCase } from "@/domain/interface/creator/register/IRegisterCreatorUseCase";
import { IPasswordService } from "@/domain/interface/service/IPasswordService";
import { IOTPService } from "@/domain/interface/service/IOtpServices";
import { IMailService } from "@/domain/interface/service/IMailServices";
import { IRedisService } from "@/domain/interface/service/IRedisServices";
import { renderTemplate } from "@/utils/renderTemplates";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";

export class RegisterCreatorUseCase implements IRegisterCreatorUseCase {
  constructor(
    private _creatorRepo: ICreatorRepository,
    private _passwordService: IPasswordService,
    private _userRepo: IUserRepository,
    private _otpService: IOTPService,
    private _mailService: IMailService,
    private _redisService: IRedisService
  ) {}

  async registerCreator(data: CreatorEntity): Promise<CreatorEntity> {
    const email = data.email.trim().toLowerCase();

    const existing = await this._creatorRepo.findByEmail(email);
    if (existing) throw new Error("Creator already exists");

    const existingUser = await this._userRepo.findByEmail(email);
    if (existingUser) throw new Error("This email is already registered as a user");

    if (!data.password) throw new Error("Password requires");
    const hashedPassword = await this._passwordService.hash(data.password);

    const pendingCreator = {
      ...data,
      email,
      password: hashedPassword,
      status: "pending" as const
    };

    const isPreVerified = await this._redisService.getValue(`VERIFIED_CREATOR_EMAIL_${email}`);
    if (isPreVerified) {
      const createdCreator = await this._creatorRepo.createCreator(pendingCreator);
      await this._redisService.deleteValue(`VERIFIED_CREATOR_EMAIL_${email}`);
      return createdCreator;
    }

    await this._redisService.setValue(`PENDING_CREATOR_${email}`, JSON.stringify(pendingCreator), 300);

    const otp = await this._otpService.generateOtp(email);
    console.log("Creator OTP:", otp);

    const htmlTemplate = renderTemplate("user/otp.html", {
      TITLE: "Verify Your Email",
      MESSAGE: "Enter the verification code to complete your creator registration",
      OTP_CODE: otp.toString(),
    });

    await this._mailService.sendMail(
      email,
      "Verify Your Creator Account",
      htmlTemplate
    );

    return { ...pendingCreator, _id: "" } as CreatorEntity;
  }
}

