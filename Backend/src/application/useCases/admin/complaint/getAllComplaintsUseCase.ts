import { ComplaintMapper } from "@/application/mapper/user/complaintMapper";
import { ComplaintResponseDTO } from "@/domain/dto/complaint/complaintResponseDto";
import { IGetAllComplaintsUseCase } from "@/domain/interface/admin/complaint/IGetAllComplaintsUseCase";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";

export class GetAllComplaintsUseCase implements IGetAllComplaintsUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

  async getAllComplaint(): Promise<ComplaintResponseDTO[]> {
    const complaints = await this.complaintRepository.findAll();
    return complaints.map(ComplaintMapper.toDto);
  }
}
