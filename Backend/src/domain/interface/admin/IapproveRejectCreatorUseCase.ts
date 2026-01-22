export interface IapproveRejectCreatorUseCase {
  approveCreator(creatorId: string): Promise<void>;
  rejectCreator(creatorId: string, reason: string): Promise<void>;
}
