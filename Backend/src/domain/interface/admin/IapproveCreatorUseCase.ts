export interface IapproveCreatorUseCase {
    approveCreator(creatorId: string): Promise<void>;
}
