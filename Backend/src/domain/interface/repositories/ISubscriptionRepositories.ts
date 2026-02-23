import { SubscriptionEntity } from "@/domain/entities/subscriptionEntity";
import { IBaseRepository } from "./IBaseRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    findByType(type: 'User' | 'Creator'): Promise<SubscriptionEntity[]>
    findSubscriptions(type?: 'User' | 'Creator', page?: number, limit?: number, isActive?: boolean): Promise<PaginatedResult<SubscriptionEntity>>
}