
export interface ICountUnreadUseCase {
  countUnread(recipientId: string): Promise<number>;
}