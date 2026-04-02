import type { IWallpaperWebhookUseCase } from "@/domain/interfaces/user/wallpaper/IWallpaperWebhookUseCase";
import type { IWallpaperRepository } from "@/domain/interfaces/repository/IWallpaperRepository";
import type { ICreatorRepository } from "@/domain/interfaces/repository/ICreatorRepository";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";
import type { ICreditWalletUseCase } from "@/domain/interfaces/wallet/ICreditWalletUseCase";
import { logger } from "@/utils/logger";
import type Stripe from "stripe";

import type { ISendNotificationUseCase } from "@/domain/interfaces/notification/ISendNotificationUseCase";
import { NotificationType } from "@/domain/entities/notificationEntity";

import type { IWalletRepository } from "@/domain/interfaces/repository/IWalletRepository";
import type { IWallpaperDownloadRepository } from "@/domain/interfaces/repository/IWallpaperDownloadRepository";

export class WallpaperWebhookUseCase implements IWallpaperWebhookUseCase {
    constructor(
        private _wallpaperDownloadRepo: IWallpaperDownloadRepository,
        private _wallpaperRepo: IWallpaperRepository,
        private _creatorRepo: ICreatorRepository,
        private _creditWalletUseCase: ICreditWalletUseCase,
        private _sendNotificationUseCase: ISendNotificationUseCase,
        private _userRepo: IUserRepository,
        private _walletRepo: IWalletRepository
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

                    const wallpaper = await this._wallpaperRepo.findById(wallpaperId);
                    const creator = await this._creatorRepo.findById(creatorId);
                    
                    if (wallpaper) {
                        const totalAmount = wallpaper.price;
                        const commission = Math.round(totalAmount * 0.1);
                        const creatorAmount = totalAmount - commission;

                        await this._creditWalletUseCase.creditWallet("admin", "admin", commission, {
                            amount: commission,
                            type: "credit",
                            description: `Commission (10%) for wallpaper sale: ${wallpaper.title}`,
                            source: "wallpaper",
                            sourceId: wallpaperId,
                            relatedName: creator?.fullName || 'Creator'
                        });

                        await this._walletRepo.updateBalance(creatorId, "creator", creatorAmount, {
                            amount: creatorAmount,
                            type: "credit",
                            description: `Payment received for wallpaper: ${wallpaper.title} (Direct split - 90%)`,
                            source: "wallpaper",
                            sourceId: wallpaperId,
                        });

                        await this._sendNotificationUseCase.sendNotification({
                            recipientId: creatorId,
                            type: NotificationType.WALLET,
                            title: "Wallpaper Sale!",
                            message: `Wallpaper ${wallpaper.title} sold! ₹${creatorAmount} credited to your wallet (90% share).`,
                            isRead: false
                        });

                        await this._sendNotificationUseCase.sendNotification({
                            recipientId: userId,
                            type: NotificationType.WALLET,
                            title: "Wallpaper Purchased",
                            message: `You have successfully purchased ${wallpaper.title}`,
                            isRead: false
                        });

                        const adminId = await this._userRepo.findAdminId();
                        if (adminId) {
                            await this._sendNotificationUseCase.sendNotification({
                                recipientId: adminId,
                                type: NotificationType.WALLET,
                                title: "Commission Earned (Wallpaper)",
                                message: `Admin wallet credited ₹${commission} (10% commission) for wallpaper: ${wallpaper.title}`,
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
