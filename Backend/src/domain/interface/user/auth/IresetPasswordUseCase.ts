export interface IresetPasswordUseCase{
    reset(email:string,newPassword:string):Promise<void>
}