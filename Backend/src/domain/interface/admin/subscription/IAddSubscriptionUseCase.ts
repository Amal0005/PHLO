import type { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import type { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";

export interface IAddSubscriptionUseCase {
    addSubscription(data: Partial<SubscriptionEntity>): Promise<SubscriptionDTO>
}