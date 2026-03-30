import type { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { WallpaperStatus } from "@/constants/wallpaperStatus";
import type { IBaseRepository } from "@/domain/interface/repository/IBaseRepository";

export interface IWallpaperRepository extends IBaseRepository<WallpaperEntity> {
    add(data: WallpaperEntity): Promise<WallpaperEntity>
    findByCreatorId(creatorId: string, page: number, limit: number, search?: string, status?: WallpaperStatus): Promise<PaginatedResult<WallpaperEntity>>
    findByStatus(status: WallpaperStatus, page: number, limit: number): Promise<PaginatedResult<WallpaperEntity>>
    findAllWallpapers(page: number, limit: number, status?: WallpaperStatus, search?: string, hashtag?: string, minPrice?: number, maxPrice?: number, ids?: string[]): Promise<PaginatedResult<WallpaperEntity>>;
    findApproved(page: number, limit: number, search?: string, hashtag?: string, minPrice?: number, maxPrice?: number, ids?: string[]): Promise<PaginatedResult<WallpaperEntity>>;
    updateStatus(id: string, status: WallpaperStatus, rejectionReason?: string): Promise<WallpaperEntity | null>;
}