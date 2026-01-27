import { IRedisService } from "@/domain/interface/service/IredisServices";
import { ITokenBlacklistService } from "@/domain/interface/service/ItokenBlacklistService";


export class TokenBlacklistService implements ITokenBlacklistService{
    constructor(
        private _redisService:IRedisService
    ){}
    async blacklistToken(token: string, exp: number): Promise<void> {
        const now=Math.floor(Date.now()/1000)
        const ttl=exp-now
        if(ttl>0){
            await this._redisService.setValue(`bl:${token}`,"1",ttl)
        }
    }
    async isTokenBlacklisted(token: string): Promise<boolean> {
        const value=await this._redisService.getValue(`bl:${token}`)
        return value==="1"
    }
}
