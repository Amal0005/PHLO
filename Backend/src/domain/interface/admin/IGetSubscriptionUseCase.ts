import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IGetSubscriptionUseCase {
    getSubscription(type?: 'User' | 'Creator', page?: number, limit?: number): Promise<PaginatedResult<SubscriptionDTO>>
}   