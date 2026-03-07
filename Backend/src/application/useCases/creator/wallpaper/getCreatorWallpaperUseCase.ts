import { WallpaperMapper } from "@/application/mapper/creator/wallpaperMapper";
import { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import { IGetCreatorWallpapersUseCase } from "@/domain/interface/creator/walpapper/IGetCreatorWallpaperUseCase";
import { IWallpaperRepository } from "@/domain/interface/repositories/IWallpaperRepository";
import { PaginatedResult } from "@/domain/types/paginationTypes";
import { WallpaperStatus } from "@/utils/wallpaperStatus";

export class GetCreatorWallpaperUseCase implements IGetCreatorWallpapersUseCase {
    constructor(
        private wallpaperRepo: IWallpaperRepository
    ) {}
    async getWallpapers(creatorId: string, page: number, limit: number, search?: string, status?: WallpaperStatus): Promise<PaginatedResult<WallpaperResponseDto>> {
        const result = await this.wallpaperRepo.findByCreatorId(creatorId, page, limit, search, status);
        return {
            ...result,
            data: result.data.map(wp => WallpaperMapper.toDto(wp))
        };
    }
}