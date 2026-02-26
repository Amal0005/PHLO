export interface IToggleUserStatusUseCase {
    toggleStatus(userId: string, status: "active" | "blocked"): Promise<void>;
}
