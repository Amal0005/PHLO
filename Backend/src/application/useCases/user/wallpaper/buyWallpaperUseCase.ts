import { IBuyWallpaperUseCase } from "@/domain/interface/user/wallpaper/IBuyWallpaperUseCase";
import { IWallpaperRepository } from "@/domain/interface/repository/IWallpaperRepository";
import { IStripeService } from "@/domain/interface/service/IStripeService";
import { CheckoutSessionResponseDTO } from "@/domain/dto/payment/checkoutSessionResponseDto";
import { IWallpaperDownloadRepository } from "@/domain/interface/repository/IWallpaperDownloadRepository";

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

    return await this._stripeService.createCheckoutSession({
      wallpaperId: wallpaper._id,
      userId: userId,
      creatorId: wallpaper.creatorId.toString(),
      packageName: `Wallpaper: ${wallpaper.title}`,
      amount: wallpaper.price,
      successUrl,
      cancelUrl,
      type: "wallpaper",
    });
  }
}
