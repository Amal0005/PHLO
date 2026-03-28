import { SubscriptionDtoMapper } from "@/application/mapper/admin/subscriptionMapper";
import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { SubscriptionRequestDto } from "@/domain/dto/subscription/subscriptionRequestDto";
import { IEditSubscriptionUseCase } from "@/domain/interface/admin/subscription/IEditSubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repository/ISubscriptionRepositories";

export class EditSubscriptionUseCase implements IEditSubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository
    ) {}
    async editSubscription(id: string, data: Partial<SubscriptionRequestDto>): Promise<SubscriptionDTO | null> {
        const updated = await this._subscriptionRepo.update(id, data);
        return updated ? SubscriptionDtoMapper.toDTO(updated) : null;
    }
}