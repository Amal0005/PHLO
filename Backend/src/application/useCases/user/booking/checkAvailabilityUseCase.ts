import { IBookingRepository } from "@/domain/interface/repositories/IBookingRepository";
import { ILeaveRepository } from "@/domain/interface/repositories/ILeaveRepository";
import { IPackageRepository } from "@/domain/interface/repositories/IPackageRepository";
import { ICheckAvailabilityUseCase } from "@/domain/interface/user/booking/ICheckAvailabilityUseCase";
import { CreatorEntity } from "@/domain/entities/creatorEntities";

export class CheckAvailabilityUseCase implements ICheckAvailabilityUseCase {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _leaveRepository: ILeaveRepository,
        private _packageRepository: IPackageRepository
    ) { }

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
