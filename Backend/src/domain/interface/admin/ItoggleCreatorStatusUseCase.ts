export interface IToggleCreatorStatusUseCase {
    execute(creatorId: string, status: "approved" | "blocked"): Promise<void>;
}
