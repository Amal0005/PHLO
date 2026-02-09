export interface IcheckCreatorExistsUseCase {
    checkExists(email: string,phone:string): Promise<void>;
}
