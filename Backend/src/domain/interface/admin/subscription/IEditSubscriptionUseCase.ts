import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";

export interface IEditSubscriptionUseCase {
    editSubscription(id: string, data: Partial<SubscriptionEntity>): Promise<SubscriptionDTO | null>
}
