export interface IToggleCreatorStatusUseCase {
    toggleStatus(creatorId: string, status: "approved" | "blocked"): Promise<void>;
}
