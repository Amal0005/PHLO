import { uploadController } from "@/framework/depInjection/s3Injections";
import { Router, Request, Response } from "express";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";

export class UploadRoutes {
  public uploadRouter: Router;

  constructor() {
    this.uploadRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.uploadRouter.post(BACKEND_ROUTES.UPLOAD.PRESIGN, (req: Request, res: Response) =>
      uploadController.getPresignedUrl(req, res)
    );

    this.uploadRouter.get(BACKEND_ROUTES.UPLOAD.VIEW_URL, (req: Request, res: Response) =>
      uploadController.getViewUrl(req, res)
    );
  }
}
