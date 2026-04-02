import type { IComplaintRepository } from "@/domain/interfaces/repository/IComplaintRepository";
import type { IGetComplaintByBookingUseCase } from "@/domain/interfaces/user/complaint/IGetComplaintByBookingUseCase";
import type { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";
import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";

export class GetComplaintByBookingUseCase implements IGetComplaintByBookingUseCase {
    constructor(private complaintRepository: IComplaintRepository) {}

    async getComplaint(bookingId: string): Promise<ComplaintResponseDTO | null> {
        const complaint = await this.complaintRepository.findByBookingId(bookingId);
        return complaint ? ComplaintMapper.toDto(complaint) : null;
    }
}
