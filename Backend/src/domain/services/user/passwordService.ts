import { IpasswordService } from "../../interface/service/IpasswordService";
import bcrypt from "bcryptjs"

export class PasswordService implements IpasswordService{
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password,10)
    }
    async compare(plain: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plain,hashed)
    }
}