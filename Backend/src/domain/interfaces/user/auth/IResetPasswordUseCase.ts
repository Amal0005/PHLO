export interface IResetPasswordUseCase{
    reset(email:string,newPassword:string):Promise<void>
}
