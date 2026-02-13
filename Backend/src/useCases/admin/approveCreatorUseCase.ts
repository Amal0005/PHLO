import { IMailService } from "@/domain/interface/service/IMailServices";
import { IApproveCreatorUseCase } from "../../domain/interface/admin/IApproveCreatorUseCase";
import { ICreatorRepository } from "../../domain/interface/creator/ICreatorRepository";
import { MESSAGES } from "@/utils/commonMessages";
import { renderTemplate } from "@/utils/renderTemplates";
import path from "node:path";

export class ApproveCreatorUseCase implements IApproveCreatorUseCase {
  constructor(
    private _creatorRepo: ICreatorRepository,
    private _mailService: IMailService,
  ) { }
  async approveCreator(creatorId: string): Promise<void> {
    if (!creatorId) throw new Error(MESSAGES.ADMIN.CREATOR_ID_REQUIRED);
    const creator = await this._creatorRepo.findById(creatorId);
    if (!creator) throw new Error(MESSAGES.CREATOR.NOT_FOUND);

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

