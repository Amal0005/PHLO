import { Request, Response } from "express";
import { IadminUserListingUseCase } from "../../../domain/interface/admin/IadminUserListingUseCase";
import { IadminCreatorListingUseCase } from "../../../domain/interface/admin/IadminCreatorListingUseCase";

export class AdminUserController {
  constructor(
    private _adminUserListingUseCase: IadminUserListingUseCase,
    private _adminCreatorListingUseCase:IadminCreatorListingUseCase
  ) {}
  async getUsers(req: Request, res: Response) {
    try {
      const data = await this._adminUserListingUseCase.getAllUsers()
      const users=data.filter((item)=>item.role=="user")
        
      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }
  async getCreators(req: Request, res: Response){
    try {
        const data=await this._adminCreatorListingUseCase.getAllCreators()
        return res.status(200).json({
            success:true,
            data
        })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }
}
