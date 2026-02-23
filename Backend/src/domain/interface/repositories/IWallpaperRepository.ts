import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";

export interface IWallpaperRepository {
    add(data:WallpaperEntity):Promise<WallpaperEntity>
    findByCreatorId( creatorId: string,page: number,limit: number,search?: string):Promise<PaginatedResult<WallpaperEntity>>
    findByStatus(status:WallpaperStatus,page:number,limit:number):Promise<PaginatedResult<WallpaperEntity>>
    findApproved(page: number,limit: number,search?: string): Promise<PaginatedResult<WallpaperEntity>>;
    updateStatus(id: string,status: WallpaperStatus,rejectionReason?: string): Promise<WallpaperEntity | null>;
}