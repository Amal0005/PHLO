import { User } from "../../../entities/userEntities";

export interface IgoogleLoginUseCase {
  execute(
    idToken: string
  ): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>;
}
