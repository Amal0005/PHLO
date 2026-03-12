import cron from "node-cron";
import { ISubscriptionScheduler } from "@/domain/interface/service/ISubscriptionScheduler";
import { ICreatorRepository } from "@/domain/interface/repository/ICreatorRepository";
import { IMailService } from "@/domain/interface/service/IMailServices";
import { renderTemplate } from "@/utils/renderTemplates";
import { logger } from "@/utils/logger";
import path from "node:path";

export class SubscriptionScheduler implements ISubscriptionScheduler {
    constructor(
        private readonly _creatorRepo: ICreatorRepository,
        private readonly _mailService: IMailService
    ) {}

    start(): void {
cron.schedule("*/5 * * * *", async () => {
                await this._promoteExpiredSubscriptions();
        });
        logger.info("Subscription scheduler started");
    }

    private async _promoteExpiredSubscriptions(): Promise<void> {
        logger.info("Running subscription promotion job...");

        // 1. Handle Upgrades (Promotions)
        const creatorsToPromote = await this._creatorRepo.findCreatorsWithExpiredSubscriptions();

        for (const creator of creatorsToPromote) {
            await this._creatorRepo.activateUpcomingSubscription(creator._id!);
            logger.info("Promoted upcoming subscription to active", {
                creatorId: creator._id,
                planName: creator.upcomingSubscription!.planName,
            });

            const endDate = new Date(creator.upcomingSubscription!.endDate);
            const html = renderTemplate("subscriptionActivated.html", {
                name: creator.fullName,
                planName: creator.upcomingSubscription!.planName,
                endDate: endDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
            });

            await this._mailService.sendMail(
                creator.email,
                "Your New Subscription is Now Active",
                html,
                [{
                    filename: "Logo_white.png",
                    path: path.join(process.cwd(), "public", "Logo_white.png"),
                    cid: "phlo-logo",
                }]
            );
        }

        // 2. Handle Plain Expirations (No upgrade queued)
        const now = new Date();
        const creatorsToExpire = await this._creatorRepo.findAll({
            "subscription.status": "active",
            "subscription.endDate": { $lte: now },
            upcomingSubscription: { $exists: false }
        });

        for (const creator of creatorsToExpire) {
            await this._creatorRepo.updateSubscriptionStatus(creator._id!, "expired");

            logger.info("Marked subscription as expired", { creatorId: creator._id });

            const html = renderTemplate("subscriptionExpired.html", {
                name: creator.fullName,
                planName: creator.subscription!.planName,
                renewUrl: `${process.env.FRONTEND_URL}/creator/subscriptions`
            });

            await this._mailService.sendMail(
                creator.email,
                "Your Subscription Has Expired",
                html,
                [{
                    filename: "Logo_white.png",
                    path: path.join(process.cwd(), "public", "Logo_white.png"),
                    cid: "phlo-logo",
                }]
            );
        }
    }
}
