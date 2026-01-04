import redis from "../../../framework/redis/redisClient";
import { IPendingUserService } from "../../interface/service/IpendingUserService";

export class PendingUserService implements IPendingUserService{
    async getPending(email: string): Promise<string | null> {
        return redis.get(`PENDING_USER_${email}`)
    }
    async deletePending(email: string): Promise<void> {
       await redis.del(`PENDING_USER_${email}`)
    }
}