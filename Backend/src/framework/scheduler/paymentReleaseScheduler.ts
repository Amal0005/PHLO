import cron from "node-cron";
import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IComplaintRepository } from "@/domain/interface/repository/IComplaintRepository";
import { IWalletRepository } from "@/domain/interface/repository/IWalletRepository";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { logger } from "@/utils/logger";
import { NotificationType } from "@/domain/entities/notificationEntity";
import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";

export class PaymentReleaseScheduler {
    constructor(
        private bookingRepository: IBookingRepository,
        private complaintRepository: IComplaintRepository,
        private walletRepository: IWalletRepository,
        private packageRepository: IPackageRepository,
        private sendNotificationUseCase: ISendNotificationUseCase
    ) {}

    start() {
        cron.schedule("*/5 * * * *", async () => {
            logger.info("Starting daily payment release check...");
            await this.releasePayments();
        });

        this.releasePayments();
    }

    async releasePayments() {
        try {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            const pendingBookings = await this.bookingRepository.findBookingsForPaymentRelease(today);

            logger.info(`PaymentReleaseScheduler: Found ${pendingBookings.length} bookings pending payment release.`);

            for (const booking of pendingBookings) {
                try {
                    const bookingId = booking.id!;

                    const complaint = await this.complaintRepository.findByBookingId(bookingId);

                    if (complaint && complaint.status === "pending") {
                        logger.info(`PaymentReleaseScheduler: Skipping booking ${bookingId} due to pending complaint.`);
                        continue;
                    }

                    const pkg = await this.packageRepository.findById(typeof booking.packageId === 'string' ? booking.packageId : (booking.packageId as unknown as { _id?: { toString(): string } })._id?.toString() || "");
                    if (!pkg) {
                        logger.error(`PaymentReleaseScheduler: Package not found for booking ${bookingId}`);
                        continue;
                    }

                    const creatorId = typeof pkg.creatorId === 'string' ? pkg.creatorId : (pkg.creatorId as unknown as { _id?: { toString(): string } })._id?.toString() || "";

                    const totalAmount = booking.amount;
                    const commission = Math.round(totalAmount * 0.2);
                    const creatorAmount = totalAmount - commission;

                    // 1. Debit Admin Wallet (Only the creator's share, admin retains commission)
                    await this.walletRepository.updateBalance("admin", "admin", -creatorAmount, {
                        amount: creatorAmount,
                        type: "debit",
                        description: `Payment release for booking ${bookingId} (Total: ₹${totalAmount}, Commission: ₹${commission})`,
                        source: "booking",
                        sourceId: bookingId,
                        relatedName: "creator_payout"
                    });

                    // 2. Credit Creator Wallet
                    await this.walletRepository.updateBalance(creatorId, "creator", creatorAmount, {
                        amount: creatorAmount,
                        type: "credit",
                        description: `Payment received for booking ${bookingId} (After 20% admin commission)`,
                        source: "booking",
                        sourceId: bookingId,
                    });

                    // 3. Update Booking Payment Status
                    await this.bookingRepository.updatePaymentStatus(bookingId, "released");

                    // 4. Notify Creator
                    await this.sendNotificationUseCase.sendNotification({
                        recipientId: creatorId,
                        type: NotificationType.WALLET,
                        title: "Payment Released",
                        message: `Payment of ₹${creatorAmount} for booking ${bookingId} has been released to your wallet (after commission).`,
                        isRead: false
                    });

                    logger.info(`PaymentReleaseScheduler: Released ₹${creatorAmount} for booking ${bookingId} to creator ${creatorId}. Admin commission: ₹${commission}`);

                } catch (err) {
                    logger.error(`PaymentReleaseScheduler: Failed to release payment for booking ${booking.id}`, { error: (err as Error).message });
                }
            }
        } catch (error) {
            logger.error("PaymentReleaseScheduler: Error in releasePayments task", { error: (error as Error).message });
        }
    }
}
