export interface IchangePasswordUseCase{
    changePassword(userId:string,currentPassword:string,newPassword:string):Promise<void>
}