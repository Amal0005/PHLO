import { ComplaintEntity } from "@/domain/entities/complaintEntity";

export interface IGetComplaintByBookingUseCase {
    getComplaint(bookingId: string): Promise<ComplaintEntity | null>;
}