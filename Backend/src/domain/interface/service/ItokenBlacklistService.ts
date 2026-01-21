export interface ITokenBlacklistService {
  blacklistToken(token: string, exp: number): Promise<void>;
  isTokenBlacklisted(token: string): Promise<boolean>;
}