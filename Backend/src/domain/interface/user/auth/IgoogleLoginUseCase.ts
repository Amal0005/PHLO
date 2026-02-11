import { User } from "../../../entities/userEntities";

export interface IGoogleLoginUseCase {
  execute(
    idToken: string
  ): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>;
}

