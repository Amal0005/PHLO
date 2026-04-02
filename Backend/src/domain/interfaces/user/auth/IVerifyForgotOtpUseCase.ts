export interface IVerifyForgotOtpUseCase {
    verify(email:string,otp:string):Promise<void>
}
