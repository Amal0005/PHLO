import { SubscriptionDtoMapper } from "@/application/mapper/admin/subscriptionMapper";
import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { IGetSubscriptionUseCase } from "@/domain/interface/admin/subscription/IGetSubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetSubscriptionUseCase implements IGetSubscriptionUseCase {
  constructor(private _subscriptionRepo: ISubscriptionRepository) { }
  async getSubscription(page: number = 1, limit: number = 10, isActive?: boolean): Promise<PaginatedResult<SubscriptionDTO>> {
    const res = await this._subscriptionRepo.findSubscriptions(page, limit, isActive);

    if (!res.data || res.data.length === 0) throw new Error("No subscriptions found");

    return {
      ...res,
      data: SubscriptionDtoMapper.toDTOList(res.data)
    };
  }
}
