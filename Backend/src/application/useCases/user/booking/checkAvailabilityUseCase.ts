import type { IBookingRepository } from "@/domain/interfaces/repository/IBookingRepository";
import type { ILeaveRepository } from "@/domain/interfaces/repository/ILeaveRepository";
import type { IPackageRepository } from "@/domain/interfaces/repository/IPackageRepository";
import type { ICheckAvailabilityUseCase } from "@/domain/interfaces/user/booking/ICheckAvailabilityUseCase";
import type { CreatorEntity } from "@/domain/entities/creatorEntities";

export class CheckAvailabilityUseCase implements ICheckAvailabilityUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _leaveRepository: ILeaveRepository,
        private _packageRepository: IPackageRepository
    ) {}

    async checkAvailability(packageId: string, dateString: Date): Promise<boolean> {
        const packageData = await this._packageRepository.findById(packageId);
        if (!packageData) {
            throw new Error("Package not found");
        }
        const date = new Date(dateString);
        date.setUTCHours(0, 0, 0, 0);

        let creatorId: string;
        if (typeof packageData.creatorId === 'string') {
            creatorId = packageData.creatorId;
        } else {
            // Type narrowing for CreatorEntity
            const creator = packageData.creatorId as CreatorEntity;
            creatorId = creator._id?.toString() || "";
        }

        if (!creatorId) {
            throw new Error("Creator ID not found for this package");
        }

        const isCreatorOnLeave = await this._leaveRepository.isDateBlocked(
            creatorId,
            date
        );

        if (isCreatorOnLeave) {
            return false;
        }
        return await this._bookingRepository.checkAvailability(packageId, date);
    }

}
