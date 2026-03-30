import type { CreatorEntity } from "@/domain/entities/creatorEntities";
import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { IBaseRepository } from "@/domain/interface/repository/IBaseRepository";

export interface ICreatorRepository extends IBaseRepository<CreatorEntity> {
  createCreator(data: CreatorEntity,): Promise<CreatorEntity>
  findByEmail(email: string): Promise<CreatorEntity | null>
  updateStatus(createrId: string, status: "pending" | "approved" | "rejected" | "blocked", reason?: string): Promise<void>
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  findAllCreators(page: number, limit: number, search?: string, status?: string): Promise<PaginatedResult<CreatorEntity>>;
  findByPhone(phone: string | undefined): Promise<CreatorEntity | null>
  updateProfile(creatorId: string, data: Partial<CreatorEntity>): Promise<CreatorEntity | null>
  activateUpcomingSubscription(creatorId: string): Promise<void>
  findCreatorsWithExpiredSubscriptions(): Promise<CreatorEntity[]>
  expireSubscriptions(): Promise<void>
  updateSubscriptionStatus(creatorId: string, status: "active" | "expired" | "cancelled"): Promise<void>
}
