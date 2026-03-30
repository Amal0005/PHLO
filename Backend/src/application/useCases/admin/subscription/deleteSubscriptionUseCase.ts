import type { ISubscriptionRepository } from "@/domain/interface/repository/ISubscriptionRepositories";
import type { IDeleteSubscriptionUseCase } from "@/domain/interface/admin/subscription/IDeleteSubscriptionUseCase";

export class DeleteSubscriptionUseCase implements IDeleteSubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository
    ) {}
    async deleteSubscription(id: string): Promise<void> {
        await this._subscriptionRepo.delete(id)
    }
}