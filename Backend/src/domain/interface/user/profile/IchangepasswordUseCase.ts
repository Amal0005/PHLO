export interface IChangepasswordUseCase{
    changePassword(userId:string,currentPassword:string,newPassword:string):Promise<void>
}
