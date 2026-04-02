import { CreatorMapper } from "@/application/mapper/creator/creatorMapper";
import type { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";
import type { IRedisService } from "@/domain/interfaces/service/IRedisServices";
import type { IOTPService } from "@/domain/interfaces/service/IOtpServices";
import type { IVerifyCreatorOtpUseCase } from "@/domain/interfaces/creator/auth/IVerifyCreatorOtpUseCase";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { ISendNotificationUseCase } from "@/domain/interfaces/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";

export class VerifyCreatorOtpUseCase implements IVerifyCreatorOtpUseCase {
    constructor(
        private _creatorRepo: ICreatorRepository,
        private _otpService: IOTPService,
        private _redisService: IRedisService,
        private _userRepo: IUserRepository,
        private _sendNotificationUseCase: ISendNotificationUseCase
    ) {}

    async verifyOtp(email: string, otp: string): Promise<CreatorResponseDto> {
        email = email.trim().toLowerCase();

        const result = await this._otpService.verifyOtp(email, otp);
        if (result === "EXPIRED") throw new Error("Otp expired");
        if (result === "INVALID") throw new Error("Invalid Otp");

        const pending = await this._redisService.getValue(`PENDING_CREATOR_${email}`);
        if (!pending) {
            throw new Error("Registration data expired. Please start the registration process again.");
        }

        const creatorData = JSON.parse(pending);
        const createdCreator = await this._creatorRepo.createCreator(creatorData);

        await this._redisService.deleteValue(`PENDING_CREATOR_${email}`);

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
}

