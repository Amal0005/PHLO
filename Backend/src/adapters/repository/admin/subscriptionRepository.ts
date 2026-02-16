import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { BaseRepository } from "../baseRepository";
import { ISubscriptionModel, SubscriptionModel } from "@/framework/database/model/subscriptionModel";
import { ISubscriptionRepository } from "@/domain/interface/repositories/ISubscriptionRepositories";

export class SubscriptionRepository extends BaseRepository<SubscriptionEntity,ISubscriptionModel> implements ISubscriptionRepository{
      constructor() {
    super(SubscriptionModel)
  }
    protected mapToEntity(doc: ISubscriptionModel): SubscriptionEntity {
    return {
      ...doc.toObject(),
      subscriptionId: doc._id.toString(),
    };
  }
  async findByType(type: string): Promise<SubscriptionEntity[]> {
      const result=await this.model.find({type}).exec()
      return result.map((item)=>this.mapToEntity(item))
  }
}