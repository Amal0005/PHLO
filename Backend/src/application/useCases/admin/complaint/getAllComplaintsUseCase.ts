import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";
import type { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";
import type { IGetAllComplaintsUseCase } from "@/domain/interface/admin/complaint/IGetAllComplaintsUseCase";
import type { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetAllComplaintsUseCase implements IGetAllComplaintsUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

  async getAllComplaint(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<ComplaintResponseDTO>> {
    const { complaints, total } = await this.complaintRepository.findAll(page, limit, search, status);
    return {
      data: complaints.map(ComplaintMapper.toDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
