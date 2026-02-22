import { SubscriptionDetails } from "@/domain/entities/creatorEntities";
import { IConfirmSubscriptionUseCase } from "@/domain/interface/creator/payment/IConfirmSubscriptionUseCase";
import { ICreatorRepository } from "@/domain/interface/repositories/ICreatorRepository";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { IStripeService } from "@/domain/interface/service/IStripeService";

export class ConfirmSubscriptionUseCase implements IConfirmSubscriptionUseCase {
  constructor(
    private _creatorRepo: ICreatorRepository,
    private _subscriptionRepo: ISubscriptionRepository,
    private _stripeService: IStripeService
  ) {}

  async confirm(sessionId: string, creatorId: string): Promise<SubscriptionDetails | null> {
    const session = await this._stripeService.retrieveCheckoutSession(sessionId);
    if (!session) return null;

    if (session.payment_status !== "paid") return null;
    if (session.metadata?.type !== "subscription") return null;
    if (session.metadata?.creatorId !== creatorId) return null;

    const subscriptionId = session.metadata?.subscriptionId;
    if (!subscriptionId) return null;

    const plan = await this._subscriptionRepo.findById(subscriptionId);
    if (!plan) return null;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration * 30);

    const subscription: SubscriptionDetails = {
      planId: subscriptionId,
      planName: plan.name,
      status: "active",
      startDate,
      endDate,
      stripeSessionId: session.id,
    };

    await this._creatorRepo.updateProfile(creatorId, { subscription });
    return subscription;
  }
}
