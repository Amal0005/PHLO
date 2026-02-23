import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { IAddSubscriptionUseCase } from "@/domain/interface/admin/subscription/IAddSubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";

export class AddSubscriptionUseCase implements IAddSubscriptionUseCase{
    constructor(
        private _subscriptionRepo:ISubscriptionRepository
    ){}
    async addSubscription(data: Partial<SubscriptionEntity>): Promise<SubscriptionEntity> {
        return await this._subscriptionRepo.create(data)
    }
}