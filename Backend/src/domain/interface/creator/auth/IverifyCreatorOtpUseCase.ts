import { CreatorResponseDto } from "@/domain/dto/creator/creatorResponseDto";

export interface IVerifyCreatorOtpUseCase {
    verifyOtp(email: string, otp: string): Promise<CreatorResponseDto>;
}

