import type { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IGetAllComplaintsUseCase {
  getAllComplaint(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<ComplaintResponseDTO>>;
}
