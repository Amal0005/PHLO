import { IuserLoginUseCase } from "../../../../domain/interface/user/login/IuserLoginUseCase";
import { Request, Response } from "express";

export class userLoginController {
  constructor(private _userLoginUseCase: IuserLoginUseCase) {}
  async login(req: Request, res: Response) {
  try {
    const result = await this._userLoginUseCase.loginUser(req.body);

    res.status(200).json({
  user: result.user,
  accessToken: result.accessToken,
  refreshToken: result.refreshToken
});

  } catch (error) {
    console.log("Login error:", error);
    res.status(400).json({
      message: "Error occurs while login",
    });
  }
}
}
