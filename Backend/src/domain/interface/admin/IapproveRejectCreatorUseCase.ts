export interface IapproveRejectCreatorUseCase {
  approveCreator(creatorId: string): Promise<void>;
  rejectCreator(creatorId: string): Promise<void>;
}
