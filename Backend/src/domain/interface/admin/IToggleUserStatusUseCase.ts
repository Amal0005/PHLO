export interface IToggleUserStatusUseCase {
    execute(userId: string, status: "active" | "blocked"): Promise<void>;
}
