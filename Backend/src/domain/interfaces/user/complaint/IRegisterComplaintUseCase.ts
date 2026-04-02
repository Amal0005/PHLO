import type { ComplaintRequestDTO } from "@/domain/dto/complaint/complaintRequestDto";
import type { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";

export interface IRegisterComplaintUseCase {
  registerComplaint(userId: string, dto: ComplaintRequestDTO): Promise<ComplaintResponseDTO>;
}
