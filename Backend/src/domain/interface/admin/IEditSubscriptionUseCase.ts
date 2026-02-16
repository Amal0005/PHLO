import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";

export interface IEditSubscriptionUseCase {
    editSubscription(id:string,data:Partial<SubscriptionEntity>):Promise<SubscriptionEntity|null>
}