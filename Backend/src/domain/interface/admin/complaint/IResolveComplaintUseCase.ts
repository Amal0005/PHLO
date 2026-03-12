import { ComplaintEntity } from "@/domain/entities/complaintEntity";

export interface IResolveComplaintUseCase {
  resolveComplaint(complaintId: string, action: "resolve" | "dismiss", adminComment: string): Promise<ComplaintEntity | null>;
}
