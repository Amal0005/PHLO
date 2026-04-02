export interface IChangePasswordUseCase {
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>
}
