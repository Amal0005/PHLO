import { WallpaperEntity } from "@/domain/entities/wallpaperEntity";
import { IGetCreatorWallpapersUseCase } from "@/domain/interface/creator/walpapper/IGetCreatorWallpaperUseCase";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";

export class GetCreatorWallpaperUseCase implements IGetCreatorWallpapersUseCase{
    constructor(
        private wallpaperRepo:IWallpaperRepository
    ){}
    async getWallpapers(creatorId: string, page: number, limit: number, search?: string): Promise<PaginatedResult<WallpaperEntity>> {
        return await this.wallpaperRepo.findByCreatorId(creatorId,page,limit,search)
    }
}