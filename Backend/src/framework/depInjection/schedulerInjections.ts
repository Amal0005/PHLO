import { PaymentReleaseScheduler } from "@/framework/scheduler/paymentReleaseScheduler";
import { SubscriptionScheduler } from "@/framework/scheduler/subscriptionScheduler";
import { BookingRepository } from "@/adapters/repository/user/bookingRepository";
import { ComplaintRepository } from "@/adapters/repository/complaintRepository";
import { WalletRepository } from "@/adapters/repository/walletRepository";
import { PackageRepository } from "@/adapters/repository/creator/packageRepository";
import { CreatorRepository } from "@/adapters/repository/creator/creatorRepository";
import { MailService } from "@/domain/services/user/mailServices";
import { sendNotificationUseCase } from "@/framework/depInjection/notificationInjections";

const bookingRepo = new BookingRepository();
const complaintRepo = new ComplaintRepository();
const walletRepo = new WalletRepository();
const packageRepo = new PackageRepository();
const creatorRepo = new CreatorRepository();
const mailService = new MailService();

export const paymentReleaseScheduler = new PaymentReleaseScheduler(
    bookingRepo,
    complaintRepo,
    walletRepo,
    packageRepo,
    sendNotificationUseCase
);

export const subscriptionScheduler = new SubscriptionScheduler(
    creatorRepo,
    mailService
);
