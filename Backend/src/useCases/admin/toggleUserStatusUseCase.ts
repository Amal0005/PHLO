import { IToggleUserStatusUseCase } from "@/domain/interface/admin/IToggleUserStatusUseCase";
import { IUserRepository } from "../../domain/interface/user/IUserRepository";

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(private _userRepo: IUserRepository) { }

    async execute(userId: string, status: "active" | "blocked"): Promise<void> {
        await this._userRepo.updateUserStatus(userId, status);
    }
}

