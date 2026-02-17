import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";

export interface IGetSubscriptionUseCase {
    getSubscription(type?: string): Promise<SubscriptionDTO[]>
}   