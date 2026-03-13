import { IWallpaperWebhookUseCase } from "@/domain/interface/user/wallpaper/IWallpaperWebhookUseCase";
import { IWallpaperDownloadRepository } from "@/domain/interface/repository/IWallpaperDownloadRepository ";
import { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IUserRepository } from "@/domain/interface/repository/IUserRepository";
import { ICreditWalletUseCase } from "@/domain/interface/wallet/ICreditWalletUseCase";
import { logger } from "@/utils/logger";
import Stripe from "stripe";

import { ISendNotificationUseCase } from "@/domain/interface/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";

export class WallpaperWebhookUseCase implements IWallpaperWebhookUseCase {
    constructor(
        private _wallpaperDownloadRepo: IWallpaperDownloadRepository,
        private _wallpaperRepo: IWallpaperRepository,
        private _creatorRepo: ICreatorRepository,
        private _creditWalletUseCase: ICreditWalletUseCase,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _userRepo: IUserRepository
    ){}

    async handleEvent(event: Stripe.Event): Promise<void> {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const wallpaperId = session.metadata?.wallpaperId;
            const userId = session.metadata?.userId || session.client_reference_id;
            const creatorId = session.metadata?.creatorId;

            if (wallpaperId && userId && creatorId) {
                const alreadyPurchased = await this._wallpaperDownloadRepo.hasPurchased(wallpaperId, userId);
                if (!alreadyPurchased) {
                    await this._wallpaperDownloadRepo.recordDownload(wallpaperId, userId, creatorId);

                    // Credit Admin Wallet (Unified)
                    const wallpaper = await this._wallpaperRepo.findById(wallpaperId);
                    const creator = await this._creatorRepo.findById(creatorId);
                    if (wallpaper) {
                        await this._creditWalletUseCase.creditWallet("admin", "admin", wallpaper.price, {
                            amount: wallpaper.price,
                            type: "credit",
                            description: `Wallpaper purchase: ${wallpaper.title} by ${creator?.fullName || 'Creator'}`,
                            source: "wallpaper",
                            sourceId: wallpaperId,
                            relatedName: creator?.fullName || 'Creator'
                        });

                        // 3. Send Notifications
                        // To Creator
                        await this._sendNotificationUseCase.sendNotification({
                            recipientId: creatorId,
                            type: NotificationType.ACCOUNT,
                            title: "Wallpaper Sale!",
                            message: `You sold a wallpaper: ${wallpaper.title}`,
                            isRead: false
                        });

                        // To User
                        await this._sendNotificationUseCase.sendNotification({
                            recipientId: userId,
                            type: NotificationType.WALLET,
                            title: "Wallpaper Purchased",
                            message: `You have successfully purchased ${wallpaper.title}`,
                            isRead: false
                        });

                        // To Admin
                        const adminId = await this._userRepo.findAdminId();
                        if (adminId) {
                            await this._sendNotificationUseCase.sendNotification({
                                recipientId: adminId,
                                type: NotificationType.WALLET,
                                title: "Wallet Credit (Wallpaper)",
                                message: `Admin wallet credited ₹${wallpaper.price} for wallpaper purchase by ${creator?.fullName || 'Creator'}`,
                                isRead: false
                            });
                        }
                    }

                    logger.info("Wallpaper purchase recorded via webhook", { wallpaperId, userId });
                } else {
                    logger.info("Wallpaper already purchased", { wallpaperId, userId });
                }
            } else {
                logger.warn("Wallpaper purchase webhook missing data", {
                    wallpaperId: !!wallpaperId,
                    userId: !!userId,
                    creatorId: !!creatorId
                });
            }
        }
    }
}
