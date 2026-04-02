export interface ICheckEmailUseCase {
    checkEmail(userId: string, email: string): Promise<{ success: boolean; message: string }>;
}
