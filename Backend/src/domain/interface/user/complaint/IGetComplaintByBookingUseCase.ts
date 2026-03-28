import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";

export interface IGetComplaintByBookingUseCase {
    getComplaint(bookingId: string): Promise<ComplaintResponseDTO | null>;
}