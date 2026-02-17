import { SubscriptionDtoMapper } from "@/application/mapper/admin/subscriptionMapper";
import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { IGetSubscriptionUseCase } from "@/domain/interface/admin/IGetSubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";

export class GetSubscriptionUseCase implements IGetSubscriptionUseCase {
  constructor(private _subscriptionRepo: ISubscriptionRepository) { }
  async getSubscription(type?: string): Promise<SubscriptionDTO[]> {
    const res = type
      ? await this._subscriptionRepo.findByType(type)
      : await this._subscriptionRepo.findAll();

    if (!res || res.length === 0) throw new Error("No subscriptions found");
    return SubscriptionDtoMapper.toDTOList(res);
  }
}
