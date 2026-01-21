export interface ILogoutUseCase {
  logout(token: string, exp: number): Promise<void>;
}