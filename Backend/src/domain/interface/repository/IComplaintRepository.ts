import { ComplaintEntity } from "../../entities/complaintEntity";

export interface IComplaintRepository {
  create(complaint: ComplaintEntity): Promise<ComplaintEntity>;
  findAll(): Promise<ComplaintEntity[]>;
  findById(id: string): Promise<ComplaintEntity | null>;
  update(complaint: ComplaintEntity): Promise<ComplaintEntity | null>;
  findByBookingId(bookingId: string): Promise<ComplaintEntity | null>;
}
