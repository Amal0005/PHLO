import { Router, Request, Response } from "express";
import { uploadController } from "../../framework/depInjection/s3Injections";

export class UploadRoutes {
  public uploadRouter: Router;

  constructor() {
    this.uploadRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.uploadRouter.post("/presign", (req: Request, res: Response) =>
      uploadController.getPresignedUrl(req, res)
    );

    this.uploadRouter.get("/view-url", (req: Request, res: Response) =>
      uploadController.getViewUrl(req, res)
    );
  }
}
