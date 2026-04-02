import type { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import type { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";

export interface IEditSubscriptionUseCase {
    editSubscription(id: string, data: Partial<SubscriptionEntity>): Promise<SubscriptionDTO | null>
}
