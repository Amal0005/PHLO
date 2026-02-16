import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";

export interface IGetSubscriptionUseCase {
    getSubscription():Promise<SubscriptionDTO[]>
}   