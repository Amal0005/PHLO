import { uploadController } from "@/framework/depInjection/s3Injections";
import type { Request, Response } from "express";
import { Router } from "express";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";
import { validate } from "@/adapters/middlewares/zodValidator";
import { presignUrlSchema } from "@/adapters/validation/commonSchemas";

export class UploadRoutes {
  public uploadRouter: Router;

  constructor() {
    this.uploadRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.uploadRouter.post(
      BACKEND_ROUTES.UPLOAD.PRESIGN,
      validate(presignUrlSchema),
      (req: Request, res: Response) =>
        uploadController.getPresignedUrl(req, res)
    );

    this.uploadRouter.get(BACKEND_ROUTES.UPLOAD.VIEW_URL, (req: Request, res: Response) =>
      uploadController.getViewUrl(req, res)
    );
  }
}
