import { SubscriptionDtoMapper } from "@/application/mapper/admin/subscriptionMapper";
import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { IEditSubscriptionUseCase } from "@/domain/interface/admin/subscription/IEditSubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";

export class EditSubscriptionUseCase implements IEditSubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository
    ) {}
    async editSubscription(id: string, data: Partial<SubscriptionEntity>): Promise<SubscriptionDTO | null> {
        const updated = await this._subscriptionRepo.update(id, data);
        return updated ? SubscriptionDtoMapper.toDTO(updated) : null;
    }
}