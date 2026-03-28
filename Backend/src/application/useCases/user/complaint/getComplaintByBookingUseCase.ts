import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IGetComplaintByBookingUseCase } from "@/domain/interface/user/complaint/IGetComplaintByBookingUseCase";
import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";
import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";

export class GetComplaintByBookingUseCase implements IGetComplaintByBookingUseCase {
    constructor(private complaintRepository: IComplaintRepository) {}

    async getComplaint(bookingId: string): Promise<ComplaintResponseDTO | null> {
        const complaint = await this.complaintRepository.findByBookingId(bookingId);
        return complaint ? ComplaintMapper.toDto(complaint) : null;
    }
}
