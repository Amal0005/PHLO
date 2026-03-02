import { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import { IListCreatorBookingsUseCase } from "@/domain/interface/creator/bookings/IListCreatorBookingsUseCase";
import { StatusCode } from "@/utils/statusCodes";
import { Response } from "express";

export class CreatorBookingController {
    constructor(
        private _listCreatorBookingsUseCase: IListCreatorBookingsUseCase
    ) { }

    async ListCreatorBookings(req: AuthRequest, res: Response) {
        try {
            const creatorId = req.user?.userId;
            if (!creatorId) {
                return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            }
            const bookings = await this._listCreatorBookingsUseCase.listBookings(creatorId);
            res.status(StatusCode.OK).json({ success: true, data: bookings });
        } catch (error) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }
}
