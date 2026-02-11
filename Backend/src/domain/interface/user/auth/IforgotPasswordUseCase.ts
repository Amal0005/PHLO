export interface IForgotPasswordUseCase{
    sendOtp(email:string):Promise<void>
}
