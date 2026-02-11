export interface IRejectCreatorUseCase {
    rejectCreator(creatorId: string, reason: string): Promise<void>;
}

