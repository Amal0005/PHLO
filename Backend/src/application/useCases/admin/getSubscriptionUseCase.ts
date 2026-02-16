import { SubscriptionDtoMapper } from "@/application/mapper/admin/subscriptionMapper";
import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { IGetSubscriptionUseCase } from "@/domain/interface/admin/IGetSubscriptionUseCase";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";

export class GetSubscriptionUseCase implements IGetSubscriptionUseCase {
  constructor(private _subscriptionRepo: ISubscriptionRepository) {}
  async getSubscription(): Promise<SubscriptionDTO[]> {
    const res = await this._subscriptionRepo.findAll();
    if (!res || res.length === 0) throw new Error("No subscriptions found");
    return SubscriptionDtoMapper.toDTOList(res);
  }
}
