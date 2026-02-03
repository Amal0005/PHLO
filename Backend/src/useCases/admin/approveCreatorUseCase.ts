import { IMailService } from "@/domain/interface/service/ImailServices";
import { IapproveCreatorUseCase } from "../../domain/interface/admin/IapproveCreatorUseCase";
import { IcreatorRepository } from "../../domain/interface/creator/IcreatorRepository";
import { renderTemplate } from "@/utils/renderTemplates";
import path from "node:path";

export class ApproveCreatorUseCase implements IapproveCreatorUseCase {
  constructor(
    private _creatorRepo: IcreatorRepository,
    private _mailService: IMailService,
  ) {}
  async approveCreator(creatorId: string): Promise<void> {
    if (!creatorId) throw new Error("CreatorId is missing");
    const creator = await this._creatorRepo.findById(creatorId);
    if (!creator) throw new Error("Creator Not Found");

    await this._creatorRepo.updateStatus(creatorId, "approved");
    const html = renderTemplate("creatorApprovel.html", {
      name: creator.fullName,
      loginUrl: `${process.env.FRONTEND_URL}/creator/login`,
    });

    await this._mailService.sendMail(
      creator.email,
      "Your Creator Account is Approved",
      html,
      [
        {
          filename: "Logo_white.png",
          path: path.join(process.cwd(), "public", "Logo_white.png"),
          cid: "phlo-logo",
        },
      ]
    );

  }
}
