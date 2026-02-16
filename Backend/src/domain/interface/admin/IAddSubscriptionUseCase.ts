import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";

export interface IAddSubscriptionUseCase{
    addSubscription(data:Partial<SubscriptionEntity>):Promise<SubscriptionEntity>
}