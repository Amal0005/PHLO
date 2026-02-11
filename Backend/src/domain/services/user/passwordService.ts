import { IPasswordService } from "../../interface/service/IPasswordService";
import bcrypt from "bcryptjs"

export class PasswordService implements IPasswordService{
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password,10)
    }
    async compare(plain: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plain,hashed)
    }
}
