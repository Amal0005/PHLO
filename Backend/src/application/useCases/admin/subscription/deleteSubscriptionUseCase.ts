import type { ISubscriptionRepository } from "@/domain/interfaces/repository/ISubscriptionRepositories";
import type { IDeleteSubscriptionUseCase } from "@/domain/interfaces/admin/subscription/IDeleteSubscriptionUseCase";

export class DeleteSubscriptionUseCase implements IDeleteSubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository
    ) {}
    async deleteSubscription(id: string): Promise<void> {
        await this._subscriptionRepo.delete(id)
    }
}