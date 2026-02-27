import { ISubscriptionRepository } from "../repositories/ISubscriptionRepositories";
import { IDeleteSubscriptionUseCase } from "./subscription/IDeleteSubscriptionUseCase";

export class DeleteSubscriptionUseCase implements IDeleteSubscriptionUseCase{
    constructor(
    private _subscriptionRepo:ISubscriptionRepository
    ){}
    async deleteSubscription(id: string): Promise<void> {
        await this._subscriptionRepo.delete(id)
    }
}