import type { ComplaintEntity } from "@/domain/entities/complaintEntity";

export interface IComplaintRepository {
  create(complaint: ComplaintEntity): Promise<ComplaintEntity>;
  findAll(page: number, limit: number, search?: string, status?: string): Promise<{ complaints: ComplaintEntity[]; total: number }>;
  findById(id: string): Promise<ComplaintEntity | null>;
  update(complaint: ComplaintEntity): Promise<ComplaintEntity | null>;
  findByBookingId(bookingId: string): Promise<ComplaintEntity | null>;
}
