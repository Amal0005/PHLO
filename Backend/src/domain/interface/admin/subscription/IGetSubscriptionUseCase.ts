import { SubscriptionDTO } from "@/domain/dto/admin/subscriptionDto";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface IGetSubscriptionUseCase {
    getSubscription(page?: number, limit?: number, isActive?: boolean, search?: string): Promise<PaginatedResult<SubscriptionDTO>>
}   