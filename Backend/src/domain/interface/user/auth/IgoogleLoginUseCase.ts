import { User } from "../../../entities/userEntities";

export interface IGoogleLoginUseCase {
  login(
    idToken: string
  ): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>;
}

