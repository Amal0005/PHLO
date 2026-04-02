
export interface IMarkNotificationReadUseCase {
  markNotificationRead(notificationId: string): Promise<void>;
}