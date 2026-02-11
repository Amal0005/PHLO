export interface ICheckCreatorExistsUseCase {
    checkExists(email: string,phone:string): Promise<void>;
}

