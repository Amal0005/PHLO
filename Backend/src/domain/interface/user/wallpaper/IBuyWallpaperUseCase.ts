import { CheckoutSessionResponseDTO } from "../../dto/payment/checkoutSessionResponseDto";

export interface IBuyWallpaperUseCase {
    execute(
        wallpaperId: string,
        userId: string,
        successUrl: string,
        cancelUrl: string
    ): Promise<CheckoutSessionResponseDTO>;
}
