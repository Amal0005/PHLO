import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IGetComplaintByBookingUseCase } from "@/domain/interface/user/complaint/IGetComplaintByBookingUseCase";

export class GetComplaintByBookingUseCase implements IGetComplaintByBookingUseCase {
    constructor(private complaintRepository: IComplaintRepository) {}

    async getComplaint(bookingId: string): Promise<ComplaintEntity | null> {
        return await this.complaintRepository.findByBookingId(bookingId);
    }
}
