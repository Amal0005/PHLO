export interface IforgotPasswordUseCase{
    sendOtp(email:string):Promise<void>
}