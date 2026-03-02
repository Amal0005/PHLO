import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";

export interface ICheckAvailabilityUseCase {
    checkAvailability(packageId: string, date: Date): Promise<boolean>;
}
