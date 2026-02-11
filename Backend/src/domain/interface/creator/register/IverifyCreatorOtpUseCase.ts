import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IVerifyCreatorOtpUseCase {
    verifyOtp(email: string, otp: string): Promise<CreatorEntity>;
}

