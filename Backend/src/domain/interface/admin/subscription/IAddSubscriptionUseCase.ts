import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";

export interface IAddSubscriptionUseCase {
    addSubscription(data: Partial<SubscriptionEntity>): Promise<SubscriptionDTO>
}