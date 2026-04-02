import type { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import type { IBaseRepository } from "@/domain/interfaces/repository/IBaseRepository";
import type { PaginatedResult } from "@/domain/types/paginationTypes";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    findSubscriptions(page?: number, limit?: number, isActive?: boolean, search?: string): Promise<PaginatedResult<SubscriptionEntity>>
    findByName(name: string): Promise<SubscriptionEntity | null>
}