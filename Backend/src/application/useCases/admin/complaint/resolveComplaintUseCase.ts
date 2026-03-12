import { ComplaintEntity } from "@/domain/entities/complaintEntity";
import { IResolveComplaintUseCase } from "@/domain/interface/admin/complaint/IResolveComplaintUseCase";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";

export class ResolveComplaintUseCase implements IResolveComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private bookingRepository: IBookingRepository,
    private walletRepository: IWalletRepository
  ) { }

  async resolveComplaint(complaintId: string, action: "resolve" | "dismiss", adminComment: string): Promise<ComplaintEntity | null> {
    const complaint = await this.complaintRepository.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");
    if (complaint.status !== "pending") throw new Error("Complaint already processed");

    const booking = await this.bookingRepository.findById(complaint.bookingId);
    if (!booking) throw new Error("Booking not found");

    if (action === "resolve") {
      await this.walletRepository.updateBalance(complaint.userId, "user", booking.amount, {
        amount: booking.amount,
        type: "credit",
        description: `Refund for booking ${booking.id} - Complaint Resolved`,
        source: "refund",
        sourceId: complaint.bookingId,
      });
      complaint.status = "resolved";
    } else {
      await this.walletRepository.updateBalance(complaint.creatorId, "creator", booking.amount, {
        amount: booking.amount,
        type: "credit",
        description: `Payment for booking ${booking.id} - Complaint Dismissed`,
        source: "booking",
        sourceId: complaint.bookingId,
      });
      complaint.status = "dismissed";
    }

    complaint.adminComment = adminComment;
    return await this.complaintRepository.update(complaint);
  }
}
