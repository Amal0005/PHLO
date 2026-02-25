import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { BaseRepository } from "../baseRepository";
import { ISubscriptionModel, SubscriptionModel } from "@/framework/database/model/subscriptionModel";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { paginateMongo } from "@/utils/pagination";
import { Filter } from "mongodb";

export class SubscriptionRepository extends BaseRepository<SubscriptionEntity, ISubscriptionModel> implements ISubscriptionRepository {
  constructor() {
    super(SubscriptionModel)
  }
  protected mapToEntity(doc: ISubscriptionModel): SubscriptionEntity {
    return {
      ...doc.toObject(),
      subscriptionId: doc._id.toString(),
    };
  }

  async findSubscriptions(page: number = 1, limit: number = 10, isActive?: boolean): Promise<PaginatedResult<SubscriptionEntity>> {
    const query: Filter<ISubscriptionModel> = {};
    if (isActive !== undefined) query.isActive = isActive;
    const result = await paginateMongo<ISubscriptionModel>(this.model, query, page, limit, { sort: { createdAt: -1 } });

    return {
      ...result,
      data: result.data.map((item) => this.mapToEntity(item))
    };
  }
}