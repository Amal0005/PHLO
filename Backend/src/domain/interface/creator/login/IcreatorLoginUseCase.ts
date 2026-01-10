import { CreatorLoginResponseDto } from "../../../dto/creator/creatorLoginResponseDto";

export interface IcreatorLoginUseCase{
    login(email:string,password:string):Promise<CreatorLoginResponseDto>
}