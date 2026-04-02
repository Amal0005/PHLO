import { WallpaperMapper } from "@/application/mapper/creator/wallpaperMapper";
import type { WallpaperResponseDto } from "@/domain/dto/user/wallpaperResponseDto";
import type { IGetCreatorWallpapersUseCase } from "@/domain/interfaces/creator/walpapper/IGetCreatorWallpaperUseCase";
import type { IWallpaperRepository } from "@/domain/interfaces/repository/IWallpaperRepository";
import type { PaginatedResult } from "@/domain/types/paginationTypes";
import type { WallpaperStatus } from "@/constants/wallpaperStatus";

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