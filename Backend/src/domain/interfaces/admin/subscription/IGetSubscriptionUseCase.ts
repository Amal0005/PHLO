import type { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IGetSubscriptionUseCase {
    getSubscription(page?: number, limit?: number, isActive?: boolean, search?: string): Promise<PaginatedResult<SubscriptionDTO>>
}   