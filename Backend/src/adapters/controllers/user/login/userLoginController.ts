import { IuserLoginUseCase } from "../../../../domain/interface/user/login/IuserLoginUseCase";
import { Request, Response } from "express";

export class userLoginController {
  constructor(private _userLoginUseCase: IuserLoginUseCase) {}
  async login(req: Request, res: Response) {
    try {
      const userInput = req.body;
      console.log(userInput);
      const result = await this._userLoginUseCase.loginUser(userInput);

      res.status(200).json({
        message: "User logged in successfully",
        user: result,
      });
    } catch (error) {
      console.log("Login error:", error);
      res.status(400).json({
        message: "Error occures while login",
      });
    }
  }
}
