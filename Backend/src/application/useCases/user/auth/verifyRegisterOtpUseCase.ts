import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";
import { UserMapper } from "@/application/mapper/user/userMapper";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { IOTPService } from "@/domain/interfaces/service/IOtpServices";
import type { IPendingUserService } from "@/domain/interfaces/service/IPendingUserService";
import type { IVerifyRegisterOtpUseCase } from "@/domain/interfaces/user/auth/IVerifyRegisterOtpUseCase";
import { MESSAGES } from "@/constants/commonMessages";

import type { ISendNotificationUseCase } from "@/domain/interfaces/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";

export class verifyRegisterOtpUseCase implements IVerifyRegisterOtpUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _otpService: IOTPService,
    private _pendingUser: IPendingUserService,
    private _sendNotificationUseCase: ISendNotificationUseCase
  ) {}
  async verifyUser(email: string, otp: string): Promise<UserResponseDto> {
    email = email.trim().toLowerCase();
    const result = await this._otpService.verifyOtp(email, otp);
    if (result == "EXPIRED") throw new Error(MESSAGES.AUTH.OTP_EXPIRED);
    if (result == "INVALID") throw new Error(MESSAGES.AUTH.INVALID_OTP);
    const pending = await this._pendingUser.getPending(email);
    if (!pending) throw new Error("Time Expired");
    const userData = JSON.parse(pending);
    const createdUser = await this._userRepo.createUser(userData);
    await this._pendingUser.deletePending(email);

    // Notify Admin
    try {
      const adminId = await this._userRepo.findAdminId();
      if (adminId) {
        await this._sendNotificationUseCase.sendNotification({
          recipientId: adminId,
          type: NotificationType.ACCOUNT,
          title: "New User Registered",
          message: `A new user ${createdUser.name} (${createdUser.email}) has joined the platform.`,
          isRead: false
        });
      }
    } catch (error) {
      console.error("Failed to notify admin about new user registration:", error);
    }

    return UserMapper.toDto(createdUser);
  }
}

