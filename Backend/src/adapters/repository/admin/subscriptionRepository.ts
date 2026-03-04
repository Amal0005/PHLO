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

  async findSubscriptions(page: number = 1, limit: number = 10, isActive?: boolean, search?: string): Promise<PaginatedResult<SubscriptionEntity>> {
    const query: Filter<ISubscriptionModel> = {};
    if (isActive !== undefined) query.isActive = isActive;
    if (search) query.name = { $regex: search, $options: "i" } as unknown as Filter<ISubscriptionModel>["name"];
    const result = await paginateMongo<ISubscriptionModel>(this.model, query, page, limit, { sort: { createdAt: -1 } });

    return {
      ...result,
      data: result.data.map((item) => this.mapToEntity(item))
    };
  }
  async findByName(name: string): Promise<SubscriptionEntity | null> {
    const result = await this.model.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } }).exec();
    return result ? this.mapToEntity(result) : null;
  }
}