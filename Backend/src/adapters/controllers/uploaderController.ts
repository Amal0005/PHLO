// import { IGetPresignedViewUrlUseCase } from "../../domain/interface/creator/IgetPresignedViewUrlUseCase";
// import { IGetPresignedUrlUseCase } from "../../domain/interface/creator/IgetUrl";
// import { Request,Response } from "express";
// import { CreatorRepository } from "../repository/creator/creatorRepository";
// export class UploadController {
//     constructor(
//         private _getPresignedUrlUseCase:IGetPresignedUrlUseCase,
//           private _getPresignedViewUrlUseCase: IGetPresignedViewUrlUseCase,
//           private _creatorRepo:CreatorRepository

//     ){}
//     async getPresignedUrl(req:Request,res:Response){
//         try {
//             const {fileType,folder}=req.body
//              if (!fileType || !folder) {
//         return res.status(400).json({ message: "Missing" });
//       }
//       const data=await this._getPresignedUrlUseCase.execute(fileType,folder)
//       res.status(200).json(data);
//         } catch (error) {
//         res.status(500).json({ message: "Failed to generate URL" });     
//         }
//     }
//     async getViewUrl(req: Request, res: Response) {
//   try {
//     const { key } = req.query;

//     if (!key || typeof key !== "string") {
//       return res.status(400).json({ message: "Key is required" });
//     }

//     const viewUrl =
//       await this._getPresignedViewUrlUseCase.execute(key);

//     return res.status(200).json({ viewUrl });
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to generate view URL" });
//   }
// }
//  async getMe(req: Request, res: Response) {
//     try {
//       const email = req.query.email as string;

//       if (!email) {
//         return res.status(400).json({ message: "Email required" });
//       }

//       const creator = await this._creatorRepo.findByEmail(email);

//       if (!creator) {
//         return res.status(404).json({ message: "Creator not found" });
//       }

//       console.log(creator.profilePhoto);

//       return res.json({
//         profilePhoto: await this._getPresignedViewUrlUseCase.execute(creator.profilePhoto!),
//         governmentId: await this._getPresignedViewUrlUseCase.execute(creator.governmentId)
//       });
//     } catch (error) {
//       return res.status(500).json({ message: "Failed to fetch creator" });
//     }
//   }

// }




import { IGetPresignedViewUrlUseCase } from "../../domain/interface/creator/IgetPresignedViewUrlUseCase";
import { IGetPresignedUrlUseCase } from "../../domain/interface/creator/IgetUrl";
import { Request,Response } from "express";
export class UploadController {
  constructor(
    private _getPresignedUrlUseCase: IGetPresignedUrlUseCase,
    private _getPresignedViewUrlUseCase: IGetPresignedViewUrlUseCase
  ) {}

  async getPresignedUrl(req: Request, res: Response) {
    const { fileType, folder } = req.body;
    if (!fileType || !folder) {
      return res.status(400).json({ message: "Missing" });
    }

    const data = await this._getPresignedUrlUseCase.execute(fileType, folder);
    return res.json(data);
  }

  async getViewUrl(req: Request, res: Response) {
    const { key } = req.query;
    if (!key || typeof key !== "string") {
      return res.status(400).json({ message: "Key required" });
    }

    const viewUrl = await this._getPresignedViewUrlUseCase.execute(key);
    return res.json({ viewUrl });
  }
}
