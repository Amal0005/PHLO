import { IRedisService } from "../../interface/service/IRedisServices";
import { IPendingUserService } from "../../interface/service/IPendingUserService";

export class PendingUserService implements IPendingUserService {
    constructor(private _redisService: IRedisService) { }
    async getPending(email: string): Promise<string | null> {
        return this._redisService.getValue(`PENDING_USER_${email}`)
    }
    async deletePending(email: string): Promise<void> {
        await this._redisService.deleteValue(`PENDING_USER_${email}`)
    }
}
