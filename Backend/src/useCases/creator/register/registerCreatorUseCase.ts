import { CreatorEntity } from "@/domain/entities/creatorEntities";
import { IcreatorRepository } from "@/domain/interface/creator/IcreatorRepository";
import { IregisterCreatorUseCase } from "@/domain/interface/creator/register/IregisterCreatorUseCase";
import { IpasswordService } from "@/domain/interface/service/IpasswordService";
import { IuserRepository } from "@/domain/interface/user/IuserRepository";
import { IOTPService } from "@/domain/interface/service/IotpServices";
import { IMailService } from "@/domain/interface/service/ImailServices";
import redis from "@/framework/redis/redisClient";
import { renderTemplate } from "@/utils/renderTemplates";

export class RegisterCreatorUseCase implements IregisterCreatorUseCase {
  constructor(
    private _creatorRepo: IcreatorRepository,
    private _passwordService: IpasswordService,
    private _userRepo: IuserRepository,
    private _otpService: IOTPService,
    private _mailService: IMailService
  ) { }

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

    const isPreVerified = await redis.get(`VERIFIED_CREATOR_EMAIL_${email}`);
    if (isPreVerified) {
      const createdCreator = await this._creatorRepo.createCreator(pendingCreator);
      await redis.del(`VERIFIED_CREATOR_EMAIL_${email}`);
      return createdCreator;
    }

    await redis.set(`PENDING_CREATOR_${email}`, JSON.stringify(pendingCreator), {
      EX: 300,
    });

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

    // Return a placeholder entity since actual creation happens after OTP verification
    return { ...pendingCreator, _id: "" } as CreatorEntity;
  }
}