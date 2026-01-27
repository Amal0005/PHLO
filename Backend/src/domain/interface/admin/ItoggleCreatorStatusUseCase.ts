export interface ItoggleCreatorStatusUseCase {
    execute(creatorId: string, status: "approved" | "blocked"): Promise<void>;
}