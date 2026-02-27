import { IToggleUserStatusUseCase } from "@/domain/interface/admin/IToggleUserStatusUseCase";
import { IUserRepository } from "@/domain/interface/repositories/IUserRepository";

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(
        private _userRepo: IUserRepository

    ) {}

    async toggleStatus(userId: string, status: "active" | "blocked"): Promise<void> {
        await this._userRepo.updateUserStatus(userId, status);
    }
}

