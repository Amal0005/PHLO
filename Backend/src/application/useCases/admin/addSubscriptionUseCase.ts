import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { IAddSubscriptionUseCase } from "@/domain/interface/admin/subscription/IAddSubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { MESSAGES } from "@/utils/commonMessages";

export class AddSubscriptionUseCase implements IAddSubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository
    ) {}
    async addSubscription(data: Partial<SubscriptionEntity>): Promise<SubscriptionEntity> {
        if (!data.name) throw new Error(MESSAGES.ADMIN.SUBSCRIPTION_NAME_REQUIRED);
        const existing = await this._subscriptionRepo.findByName(data.name);
        if (existing) throw new Error(MESSAGES.ADMIN.SUBSCRIPTION_ALREADY_EXISTS);
        return await this._subscriptionRepo.create(data)
    }
}