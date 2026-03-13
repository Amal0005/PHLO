import { ComplaintRequestDTO } from "@/domain/dto/complaint/complaintRequestDto";
import { ComplaintEntity } from "@/domain/entities/complaintEntity";

export interface IRegisterComplaintUseCase {
  registerComplaint(userId: string, dto: ComplaintRequestDTO): Promise<ComplaintEntity>;
}
