import { SubscriptionDtoMapper } from "@/application/mapper/admin/subscriptionMapper";
import type { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import type { IGetSubscriptionUseCase } from "@/domain/interface/admin/subscription/IGetSubscriptionUseCase";
import type { ISubscriptionRepository } from "@/domain/interface/repository/ISubscriptionRepositories";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetSubscriptionUseCase implements IGetSubscriptionUseCase {
  constructor(
    private _subscriptionRepo: ISubscriptionRepository

  ) {}
  async getSubscription(page: number = 1, limit: number = 10, isActive?: boolean, search?: string): Promise<PaginatedResult<SubscriptionDTO>> {
    const res = await this._subscriptionRepo.findSubscriptions(page, limit, isActive, search);

    if (!res.data) return { ...res, data: [] };

    return {
      ...res,
      data: SubscriptionDtoMapper.toDTOList(res.data)
    };
  }
}
