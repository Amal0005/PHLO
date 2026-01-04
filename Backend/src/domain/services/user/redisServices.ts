import redis from "../../../framework/redis/redisClient";
import { IRedisService } from "../../interface/service/IredisServices";

export class RedisService implements IRedisService {
  async setValue(key: string, value: string, expiresInSeconds?: number): Promise<void> {
    if (expiresInSeconds) {
      await redis.set(key, value, { EX: expiresInSeconds });
    } else {
      await redis.set(key, value);
    }
  }

  async getValue(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  async deleteValue(key: string): Promise<void> {
    await redis.del(key);
  }
}
