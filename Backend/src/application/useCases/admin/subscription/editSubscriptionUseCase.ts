import { SubscriptionDtoMapper } from "@/application/mapper/admin/subscriptionMapper";
import type { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import type { SubscriptionRequestDto } from "@/domain/dto/subscription/subscriptionRequestDto";
import type { IEditSubscriptionUseCase } from "@/domain/interface/admin/subscription/IEditSubscriptionUseCase";
import type { ISubscriptionRepository } from "@/domain/interface/repository/ISubscriptionRepositories";

export class EditSubscriptionUseCase implements IEditSubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository
    ) {}
    async editSubscription(id: string, data: Partial<SubscriptionRequestDto>): Promise<SubscriptionDTO | null> {
        const updated = await this._subscriptionRepo.update(id, data);
        return updated ? SubscriptionDtoMapper.toDTO(updated) : null;
    }
}