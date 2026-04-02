import type { UserResponseDto } from "@/domain/dto/user/userResponseDto";

export interface IVerifyRegisterOtpUseCase {
  verifyUser(email: string, otp: string): Promise<UserResponseDto>;
}

