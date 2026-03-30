import type { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";

export interface IBuyWallpaperUseCase {
    buyWallpaper(
        wallpaperId: string,
        userId: string,
        successUrl: string,
        cancelUrl: string
    ): Promise<CheckoutSessionResponseDTO>;
}
