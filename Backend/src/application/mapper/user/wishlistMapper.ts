import { WishlistEntity } from "@/domain/entities/wishlistEntity";
import { WishlistResponseDto } from "@/domain/dto/user/wishlistResponseDto";

export class WishlistMapper {
    static toDto(entity: WishlistEntity): WishlistResponseDto {
        return {
            itemId: entity.itemId,
            itemType: entity.itemType as "wallpaper" | "package",
            createdAt: entity.createdAt,
        };
    }
}
