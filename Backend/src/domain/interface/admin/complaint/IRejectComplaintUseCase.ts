import { ComplaintEntity } from "@/domain/entities/complaintEntity";

export interface IRejectComplaintUseCase {
  rejectComplaint(complaintId: string, adminComment: string): Promise<ComplaintEntity | null>;
}
