import type { IToggleUserStatusUseCase } from "@/domain/interfaces/admin/IToggleUserStatusUseCase";
import type { IUserRepository } from "@/domain/interfaces/repository/IUserRepository";

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(
        private _userRepo: IUserRepository

    ) {}

    async toggleStatus(userId: string, status: "active" | "blocked"): Promise<void> {
        await this._userRepo.updateUserStatus(userId, status);
    }
}

