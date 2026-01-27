export interface IcheckCreatorExistsUseCase {
    checkExists(email: string): Promise<void>;
}
