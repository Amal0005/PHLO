import type { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";

export interface IRejectComplaintUseCase {
  rejectComplaint(complaintId: string, adminComment: string): Promise<ComplaintResponseDTO | null>;
}
