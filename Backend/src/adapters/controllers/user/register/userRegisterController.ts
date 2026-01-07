import { IuserRegisterUseCase } from "../../../../domain/interface/user/register/IuserRegisterUseCase";
import { Request, Response } from "express";
import { IverifyRegisterOtpUseCase } from "../../../../domain/interface/user/register/IverifyRegisterOtpUseCase";
import { IresendOtpUseCase } from "../../../../domain/interface/user/auth/IresendOtpUseCase";

export class userRegisterController {
  constructor(
    private _userRegisterUseCase: IuserRegisterUseCase,
    private _verifyOtpUseCase: IverifyRegisterOtpUseCase,
    private _resendOtpUseCase:IresendOtpUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const userInput = req.body;

      await this._userRegisterUseCase.registerUser(userInput);

      return res.status(200).json({
        success: true,
        message: "OTP sent to email. Please verify to complete registration.",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error occurred during registration",
      });
    }
  }
  
async resendOtp(req:Request,res:Response){
  try {
    const email=req.body.email?.trim().toLowerCase()
    if(!email)return res.status(400).json({message:"Email Required"})
      await this._resendOtpUseCase.resend(email)

    return res.status(200).json({success: true,message:"Email Send Successfully"})

  } catch (error) {
     return res.status(400).json({
        success: false,
        message: "Failed to resend OTP"
      })
    
  }
}

  async verifyOtp(req: Request, res: Response) {
    try {
      const email = req.body.email.trim().toLowerCase();
      const otp = String(req.body.otp);

      const user = await this._verifyOtpUseCase.verifyUser(
        email,
        otp
      );

      return res.status(200).json({
        success: true,
        message: "User Verified Successfully",
        user
      });

    } catch (error: any) {
      return res.status(400).json({
        message: error?.message || "OTP Verification Failed"
      });
    }
  }
}
