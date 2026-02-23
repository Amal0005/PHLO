import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { IEditSubscriptionUseCase } from "@/domain/interface/admin/subscription/IEditSubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";

export class EditSubscriptionUseCase implements IEditSubscriptionUseCase{
constructor(
private _subscriptionRepo:ISubscriptionRepository
){}
async editSubscription(id: string, data: Partial<SubscriptionEntity>): Promise<SubscriptionEntity | null> {
    return await this._subscriptionRepo.update(id,data)
}
}