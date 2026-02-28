import { ICreatorSubscriptionWebhookUseCase } from "@/domain/interface/creator/payment/ICreatorSubscriptionWebhookUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { logger } from "@/utils/logger";
import Stripe from "stripe";
import { Types } from "mongoose";

export class CreatorSubscriptionWebhookUseCase implements ICreatorSubscriptionWebhookUseCase {
  constructor(
    private _creatorRepo: ICreatorRepository,
    private _subscriptionRepo: ISubscriptionRepository,
    private _stripeService: IStripeService,
  ) {}

  async handle(payload: string | Buffer, signature: string) {
    const event = this._stripeService.constructEvent(payload, signature);
    await this.handleEvent(event);
  }

  async handleEvent(event: Stripe.Event) {
    try {
      console.log("CREATOR Webhook handleEvent started for type:", event.type);
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session metadata:", session.metadata);

        if (session.payment_status !== "paid") {
          logger.info("Payment not completed", {
            sessionId: session.id,
            status: session.payment_status,
          });
          return;
        }

        if (session.metadata?.type === "subscription") {
          const { creatorId, subscriptionId } = session.metadata;
          console.log(
            "Processing subscription webhook for creatorId:",
            creatorId,
            "planId:",
            subscriptionId,
          );

          if (!creatorId || !subscriptionId) {
            logger.warn(
              "Webhook missing creatorId or subscriptionId in metadata",
            );
            return;
          }

          const plan = await this._subscriptionRepo.findById(subscriptionId);
          if (!plan) {
            console.log("CRITICAL: Plan not found in DB:", subscriptionId);
            logger.warn("Subscription plan not found", { subscriptionId });
            return;
          }
          console.log("Found plan for webhook:", plan.name);

          const creator = await this._creatorRepo.findById(creatorId);
          if (!creator) {
            console.error(
              "CRITICAL: Creator not found in DB for ID from metadata:",
              creatorId,
            );
            return;
          }

          console.log("Creator search result:", {
            found: !!creator,
            creatorId,
            hasExistingSub: !!creator?.subscription,
            existingSessionId: creator?.subscription?.stripeSessionId,
          });

          if (creator.subscription?.stripeSessionId === session.id) {
            console.log(
              "Subscription already activated for this session, skipping.",
            );
            return;
          }

          const startDate = new Date();
          const duration = plan.duration || 1;
          let endDate = this.calculateExpiry(startDate, duration);

          if (session.subscription) {
            console.log(
              "Retrieving stripe subscription details for ID:",
              session.subscription,
            );
            try {
              const stripeSub = await this._stripeService.retrieveSubscription(
                session.subscription as string,
              );
              if (stripeSub && (stripeSub as any).current_period_end) {
                endDate = new Date(
                  (stripeSub as any).current_period_end * 1000,
                );
                console.log(
                  "Precise endDate from Stripe:",
                  endDate.toISOString(),
                );
              }
            } catch (subError) {
              console.warn(
                "Could not retrieve precise end date from Stripe, using calculated date.",
                subError,
              );
            }
          }

          const updateData: any = {
            subscription: creator.subscription
              ? {
                  ...creator.subscription,
                  planId: new Types.ObjectId(subscriptionId),
                  planName: plan.name,
                  status: "active",
                  endDate,
                  stripeSessionId: session.id,
                  stripeSubscriptionId: session.subscription as string,
                }
              : {
                  planId: new Types.ObjectId(subscriptionId),
                  planName: plan.name,
                  status: "active",
                  startDate,
                  endDate,
                  stripeSessionId: session.id,
                  stripeSubscriptionId: session.subscription as string,
                },
          };

          console.log("Executing DB update for creator:", creatorId);

          try {
            const updatedCreator = await this._creatorRepo.updateProfile(
              creatorId,
              updateData,
            );
            if (updatedCreator) {
              console.log("SUCCESS: Database updated for creator:", creatorId);
              logger.info("Creator subscription activated", {
                creatorId,
                planName: plan.name,
              });
            } else {
              console.error(
                "FAILED: Database updateProfile returned null for creator:",
                creatorId,
              );
            }
          } catch (dbError) {
            console.error("ERROR during database updateProfile call:", dbError);
            throw dbError;
          }
        }
      } else if (event.type === "invoice.payment_succeeded") {
        console.log("Invoice payment succeeded handler started");
        const invoice = event.data.object as any;
        const stripeSubscriptionId = invoice.subscription as string;

        if (stripeSubscriptionId) {
          const creator =
            await this._creatorRepo.findBySubscriptionId(stripeSubscriptionId);
          if (creator && creator.subscription) {
            const stripeSub =
              await this._stripeService.retrieveSubscription(
                stripeSubscriptionId,
              );
            if (stripeSub && stripeSub.status === "active") {
              const newEndDate = new Date(
                (stripeSub as any).current_period_end * 1000,
              );

              if (
                creator.subscription.endDate.getTime() !== newEndDate.getTime()
              ) {
                const updateData: any = {
                  subscription: {
                    ...creator.subscription,
                    endDate: newEndDate,
                    status: "active",
                  },
                };
                await this._creatorRepo.updateProfile(creator._id!, updateData);
                console.log(
                  "SUCCESS: Subscription renewed via invoice for creator:",
                  creator._id,
                );
              }
            }
          }
        }
      } else if (event.type === "invoice.payment_failed") {
        console.log("Invoice payment failed", event);
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const creator =
            await this._creatorRepo.findBySubscriptionId(subscriptionId);
          if (creator && creator.subscription) {
            const updateData: any = {
              subscription: {
                ...creator.subscription,
                status: "expired",
              },
            };
            await this._creatorRepo.updateProfile(creator._id!, updateData);
            logger.warn("Subscription payment failed", {
              creatorId: creator._id,
              subscriptionId,
            });
          }
        }
      } else if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const creator = await this._creatorRepo.findBySubscriptionId(
          subscription.id,
        );

        if (creator && creator.subscription) {
          if (creator.subscription.status !== "cancelled") {
            console.log("Cancelling subscription for creator:", creator._id);

            const updateData: any = {
              subscription: {
                ...creator.subscription,
                status: "cancelled",
              },
            };
            await this._creatorRepo.updateProfile(creator._id!, updateData);
            console.log(
              "SUCCESS: Subscription cancelled for creator:",
              creator._id,
            );
          }
        } else {
          console.warn("Creator or subscription not found for cancellation:", {
            subscriptionId: subscription.id,
          });
        }
      } else if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;
        const creator = await this._creatorRepo.findBySubscriptionId(
          subscription.id,
        );

        if (creator && creator.subscription) {
          const newEndDate = new Date(
            (subscription as any).current_period_end * 1000,
          );

          const updateNeeded =
            creator.subscription.endDate.getTime() !== newEndDate.getTime() ||
            creator.subscription.status !==
              (subscription.status === "active"
                ? "active"
                : creator.subscription.status);

          if (updateNeeded) {
            const updateData: any = {
              subscription: {
                ...creator.subscription,
                endDate: newEndDate,
                status:
                  subscription.status === "active"
                    ? "active"
                    : creator.subscription.status,
              },
            };
            await this._creatorRepo.updateProfile(creator._id!, updateData);
            logger.info(
              "Subscription updated/renewed via customer.subscription.updated",
              { creatorId: creator._id },
            );
          }
        }
      }
    } catch (globalError) {
      console.error(
        "FATAL ERROR in CreatorSubscriptionWebhookUseCase:",
        globalError,
      );
      logger.error("Global Webhook Processing Error", { error: globalError });
    }
  }

  private calculateExpiry(startDate: Date, months: number): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);
    return endDate;
  }
}
