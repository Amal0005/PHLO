import { IPendingUserService } from "@/domain/interface/service/IPendingUserService";
import { IRedisService } from "../../interface/service/IRedisServices";

export class PendingUserService implements IPendingUserService {
    constructor(private _redisService: IRedisService) { }
    async getPending(email: string): Promise<string | null> {
        return this._redisService.getValue(`PENDING_USER_${email}`)
    }
    async deletePending(email: string): Promise<void> {
        await this._redisService.deleteValue(`PENDING_USER_${email}`)
    }
}
