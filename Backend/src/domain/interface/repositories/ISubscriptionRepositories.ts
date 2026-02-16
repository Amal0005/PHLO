import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity>{
    findByType(type:string):Promise<SubscriptionEntity[]>
}