import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import type { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";
import type { IRegisterCreatorUseCase } from "@/domain/interfaces/creator/register/IRegisterCreatorUseCase";
import type { IPasswordService } from "@/domain/interfaces/service/IPasswordService";
import type { IOTPService } from "@/domain/interfaces/service/IOtpServices";
import type { IMailService } from "@/domain/interfaces/service/IMailServices";
import type { IRedisService } from "@/domain/interfaces/service/IRedisServices";
import { renderTemplate } from "@/utils/renderTemplates";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { ISendNotificationUseCase } from "@/domain/interfaces/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";

export class RegisterCreatorUseCase implements IRegisterCreatorUseCase {
  constructor(
    private _creatorRepo: ICreatorRepository,
    private _passwordService: IPasswordService,
    private _userRepo: IUserRepository,
    private _otpService: IOTPService,
    private _mailService: IMailService,
    private _redisService: IRedisService,
    private _sendNotificationUseCase: ISendNotificationUseCase
  ) {}

  async registerCreator(data: CreatorEntity): Promise<CreatorResponseDto> {
    const email = data.email.trim().toLowerCase();

    const existing = await this._creatorRepo.findByEmail(email);
    if (existing) throw new Error("Creator already exists");

    const existingUser = await this._userRepo.findByEmail(email);
    if (existingUser) throw new Error("This email is already registered as a user");

    if (!data.password) throw new Error("Password required");
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

      // Notify Admin
      const adminId = await this._userRepo.findAdminId();
      if (adminId) {
        await this._sendNotificationUseCase.sendNotification({
          recipientId: adminId,
          type: NotificationType.ACCOUNT,
          title: "New Creator Registration",
          message: `New creator ${createdCreator.fullName} has registered and is pending approval.`,
          isRead: false
        });
      }

      return CreatorMapper.toDto(createdCreator);
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

    return CreatorMapper.toDto({ ...pendingCreator, _id: "" } as CreatorEntity);
  }
}

