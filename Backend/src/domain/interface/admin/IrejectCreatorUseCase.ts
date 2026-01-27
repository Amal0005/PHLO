export interface IrejectCreatorUseCase {
    rejectCreator(creatorId: string, reason: string): Promise<void>;
}
