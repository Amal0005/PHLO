import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";

export interface IGetAllComplaintsUseCase {
  getAllComplaint(): Promise<ComplaintResponseDTO[]>;
}
