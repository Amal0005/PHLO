import { ComplaintRequestDTO } from "@/domain/dto/complaint/complaintRequestDto";
import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IRegisterComplaintUseCase } from "@/domain/interface/user/complaint/IRegisterComplaintUseCase";

export class RegisterComplaintUseCase implements IRegisterComplaintUseCase {
  constructor(private complaintRepository: IComplaintRepository) { }

  async registerComplaint(userId: string, dto: ComplaintRequestDTO): Promise<ComplaintEntity> {
    const complaint: ComplaintEntity = {
      ...dto,
      userId,
      status: "pending",
    };
    return await this.complaintRepository.create(complaint);
  }
}
