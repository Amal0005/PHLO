import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";

export interface IGetComplaintByBookingUseCase {
    execute(bookingId: string): Promise<ComplaintEntity | null>;
}

export class GetComplaintByBookingUseCase implements IGetComplaintByBookingUseCase {
    constructor(private complaintRepository: IComplaintRepository) {}

    async execute(bookingId: string): Promise<ComplaintEntity | null> {
        return await this.complaintRepository.findByBookingId(bookingId);
    }
}
