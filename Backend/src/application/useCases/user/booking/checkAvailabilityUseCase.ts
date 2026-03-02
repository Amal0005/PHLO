import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { ICheckAvailabilityUseCase } from "@/domain/interface/user/booking/ICheckAvailabilityUseCase";

export class CheckAvailabilityUseCase implements ICheckAvailabilityUseCase {
    constructor(private _bookingRepository: IBookingRepository) { }

    async checkAvailability(packageId: string, date: Date): Promise<boolean> {
        return await this._bookingRepository.checkAvailability(packageId, date);
    }
}
