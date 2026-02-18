import { Router, Request, Response } from "express";
import { viewController } from "@/framework/depInjection/s3Injections";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";

export class ViewRoutes {
    public viewRoutes: Router
    constructor() {
        this.viewRoutes = Router();
        this.setRoutes();
    }
    private setRoutes(): void {
        this.viewRoutes.get(BACKEND_ROUTES.UPLOAD.VIEW, (req: Request, res: Response) => {
            viewController.getImage(req, res)
        })
    }
}