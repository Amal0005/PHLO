import { IBookingRepository } from "@/domain/interface/repository/IBookingRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { IBookingWebhookUseCase } from "@/domain/interface/user/booking/IBookingWebhookUseCase ";
import { ICreditWalletUseCase } from "@/domain/interface/wallet/ICreditWalletUseCase";
import { IPackageRepository } from "@/domain/interface/repository/IPackageRepository";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { IChatRepository } from "@/domain/interface/repository/IChatRepository ";
import { BookingStatus } from "@/constants/bookingStatus";
import { logger } from "@/utils/logger";
import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";
import Stripe from "stripe";

export class BookingWebhookUseCase implements IBookingWebhookUseCase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _stripeService: IStripeService,
    private _packageRepo: IPackageRepository,
    private _creatorRepo: ICreatorRepository,
    private _creditWalletUseCase: ICreditWalletUseCase,
    private _chatRepo: IChatRepository,
    private _sendNotificationUseCase: ISendNotificationUseCase,
    private _userRepo: IUserRepository
  ) { }

  async handleWebhook(payload: string | Buffer, signature: string): Promise<void> {
    const event = this._stripeService.constructEvent(payload, signature);
    await this.handleEvent(event);
  }

  async handleEvent(event: Stripe.Event): Promise<void> {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        const booking = await this._bookingRepo.findById(bookingId);
        if (booking && booking.status === BookingStatus.COMPLETED) {
          logger.info("Booking already completed", { bookingId });
          return;
        }
        await this._bookingRepo.updateStatus(bookingId, BookingStatus.COMPLETED);

        // Credit Admin Wallet & Create Conversation
        if (booking) {
          const pkg = await this._packageRepo.findById(booking.packageId as string);
          if (pkg) {
            const creator = await this._creatorRepo.findById(pkg.creatorId as string);

            // 1. Credit Wallet
            await this._creditWalletUseCase.creditWallet("admin", "admin", booking.amount, {
              amount: booking.amount,
              type: "credit",
              description: `Booking payment: ${pkg.title} by ${creator?.fullName || 'Creator'}`,
              source: "booking",
              sourceId: bookingId,
              relatedName: creator?.fullName || 'Creator'
            });
            logger.info("Admin wallet credited for booking", { bookingId, amount: booking.amount });

            // 2. Create Conversation for the chat
            const existingConv = await this._chatRepo.getConversationByBooking(bookingId);
            if (!existingConv) {
              await this._chatRepo.createConversation({
                bookingId: bookingId as any,
                participants: [booking.userId as any, pkg.creatorId as any],
                lastMessage: "Booking confirmed! You can now start chatting.",
                lastMessageAt: new Date()
              });
              logger.info("Conversation created for new booking", { bookingId });
            }

            // 3. Send Notifications
            // To Creator
            const creatorId = typeof pkg.creatorId === 'string' ? pkg.creatorId : (pkg.creatorId as any)._id?.toString() || (pkg.creatorId as any).id?.toString();
            await this._sendNotificationUseCase.sendNotification({
              recipientId: creatorId,
              type: NotificationType.BOOKING,
              title: "New Booking",
              message: `You have a new booking for ${pkg.title}`,
              isRead: false
            });

            // To User
            const bookingUserId = typeof booking.userId === 'string' ? booking.userId : (booking.userId as any)._id?.toString() || (booking.userId as any).id?.toString();
            await this._sendNotificationUseCase.sendNotification({
              recipientId: bookingUserId,
              type: NotificationType.BOOKING,
              title: "Booking Confirmed",
              message: `Your booking for ${pkg.title} has been confirmed`,
              isRead: false
            });

            // To Admin
            const adminId = await this._userRepo.findAdminId();
            if (adminId) {
              await this._sendNotificationUseCase.sendNotification({
                recipientId: adminId,
                type: NotificationType.WALLET,
                title: "Wallet Credit (Booking)",
                message: `Admin wallet credited ₹${booking.amount} for ${creator?.fullName || 'Creator'}'s package booking`,
                isRead: false
              });
            }
          }
        }

        logger.info("Booking completed via webhook", { bookingId });
      }
    }
  }
}
