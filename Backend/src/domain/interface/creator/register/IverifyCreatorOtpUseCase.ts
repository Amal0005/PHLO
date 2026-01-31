import { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface IverifyCreatorOtpUseCase {
    verifyOtp(email: string, otp: string): Promise<CreatorEntity>;
}
