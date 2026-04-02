import type { ILogoutUseCase } from "@/domain/interfaces/ILogoutUseCase";
import type { ITokenBlacklistService } from "@/domain/interfaces/service/ITokenBlacklistService";


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

