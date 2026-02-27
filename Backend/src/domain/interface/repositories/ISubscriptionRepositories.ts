import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    findSubscriptions(page?: number, limit?: number, isActive?: boolean): Promise<PaginatedResult<SubscriptionEntity>>
}