import { CreatorLoginResponseDto } from "@/domain/dto/creator/creatorLoginResponseDto";

export interface ICreatorLoginUseCase{
    login(email:string,password:string):Promise<CreatorLoginResponseDto>
}
