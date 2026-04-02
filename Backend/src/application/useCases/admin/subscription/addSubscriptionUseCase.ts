import { SubscriptionDtoMapper } from "@/application/mapper/admin/subscriptionMapper";
import type { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import type { IAddSubscriptionUseCase } from "@/domain/interfaces/admin/subscription/IAddSubscriptionUseCase";
import type { ISubscriptionRepository } from "@/domain/interfaces/repository/ISubscriptionRepositories";
import { MESSAGES } from "@/constants/commonMessages";
import type { SubscriptionRequestDto } from "@/domain/dto/subscription/subscriptionRequestDto";

export class AddSubscriptionUseCase implements IAddSubscriptionUseCase {
    constructor(
        private _subscriptionRepo: ISubscriptionRepository
    ) {}
    async addSubscription(data: Partial<SubscriptionRequestDto>): Promise<SubscriptionDTO> {
        if (!data.name) throw new Error(MESSAGES.ADMIN.SUBSCRIPTION_NAME_REQUIRED);
        const existing = await this._subscriptionRepo.findByName(data.name);
        if (existing) throw new Error(MESSAGES.ADMIN.SUBSCRIPTION_ALREADY_EXISTS);
        const newSubscription = await this._subscriptionRepo.create(data);
        return SubscriptionDtoMapper.toDTO(newSubscription);
    }
}