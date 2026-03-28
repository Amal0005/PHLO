import { ComplaintRequestDTO } from "@/domain/dto/complaint/complaintRequestDto";
import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";

export interface IRegisterComplaintUseCase {
  registerComplaint(userId: string, dto: ComplaintRequestDTO): Promise<ComplaintResponseDTO>;
}
