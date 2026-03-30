import type { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";

export interface IResolveComplaintUseCase {
  resolveComplaint(complaintId: string, action: "resolve" | "dismiss", adminComment: string): Promise<ComplaintResponseDTO | null>;
}
