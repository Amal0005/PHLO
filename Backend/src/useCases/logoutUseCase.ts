import { ILogoutUseCase } from "@/domain/interface/IlogoutUseCase";
import { ITokenBlacklistService } from "@/domain/interface/service/ItokenBlacklistService";


export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    private blacklistService: ITokenBlacklistService
  ) {}

  async logout(token: string, exp: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;

    if (ttl > 0) {
      await this.blacklistService.blacklistToken(token, ttl);
    }
  }
}
