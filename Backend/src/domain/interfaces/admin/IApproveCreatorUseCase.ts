export interface IApproveCreatorUseCase {
    approveCreator(creatorId: string): Promise<void>;
}

