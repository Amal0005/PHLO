import { User } from "../../entities/userEntities";

export interface IadminUserListingUseCase{
    getAllUsers():Promise<User[]>
}
