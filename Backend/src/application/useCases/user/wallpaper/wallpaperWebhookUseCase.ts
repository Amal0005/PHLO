import { IWallpaperWebhookUseCase } from "@/domain/interface/user/wallpaper/IWallpaperWebhookUseCase";
import { IWallpaperDownloadRepository } from "@/domain/interface/repositories/IWallpaperDownloadRepository ";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { ICreditWalletUseCase } from "@/domain/interface/admin/wallet/ICreditWalletUseCase";
import { logger } from "@/utils/logger";
import Stripe from "stripe";

export class WallpaperWebhookUseCase implements IWallpaperWebhookUseCase {
    constructor(
        private _wallpaperDownloadRepo: IWallpaperDownloadRepository,
        private _wallpaperRepo: IWallpaperRepository,
        private _creatorRepo: ICreatorRepository,
        private _creditWalletUseCase: ICreditWalletUseCase
    ) { }

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
                        await this._creditWalletUseCase.execute("admin", "admin", wallpaper.price, {
                            amount: wallpaper.price,
                            type: "credit",
                            description: `Wallpaper purchase: ${wallpaper.title} by ${creator?.fullName || 'Creator'}`,
                            source: "wallpaper",
                            sourceId: wallpaperId,
                            relatedName: creator?.fullName || 'Creator'
                        });
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
