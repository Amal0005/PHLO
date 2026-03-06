export interface IRemoveLeaveUseCase {
  removeLeave(creatorId: string, dateString: Date): Promise<boolean>;
}
