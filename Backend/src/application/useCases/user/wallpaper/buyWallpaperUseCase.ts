import type { IBuyWallpaperUseCase } from "@/domain/interface/user/wallpaper/IBuyWallpaperUseCase";
import type { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import type { IStripeService } from "@/domain/interface/service/IStripeService";
import type { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import type { IWallpaperDownloadRepository } from "@/domain/interface/repository/IWallpaperDownloadRepository";
import { PaymentMapper } from "@/application/mapper/user/paymentMapper";

export class BuyWallpaperUseCase implements IBuyWallpaperUseCase {
  constructor(
    private _wallpaperRepo: IWallpaperRepository,
    private _stripeService: IStripeService,
    private _wallpaperDownloadRepo: IWallpaperDownloadRepository,
  ) {}

  async buyWallpaper(
    wallpaperId: string,
    userId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<CheckoutSessionResponseDTO> {
    const wallpaper = await this._wallpaperRepo.findById(wallpaperId);
    if (!wallpaper) {
      throw new Error("Wallpaper not found");
    }

    const alreadyPurchased = await this._wallpaperDownloadRepo.hasPurchased(
      wallpaperId,
      userId,
    );
    if (alreadyPurchased) {
      throw new Error("You have already purchased this wallpaper");
    }

    if (wallpaper.price === 0) {
      throw new Error("This wallpaper is free. You can download it directly.");
    }

    const sessionDto = PaymentMapper.toWallpaperCreateSessionDto(wallpaper, userId, successUrl, cancelUrl);
    const session = await this._stripeService.createCheckoutSession(sessionDto);

    return session;
  }
}
