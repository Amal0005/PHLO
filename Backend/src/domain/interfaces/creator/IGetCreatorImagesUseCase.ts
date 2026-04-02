export interface CreatorImagesDto {
    profilePhoto: string | null;
    governmentId: string | null;
}

export interface IGetCreatorImagesUseCase {
    execute(email: string): Promise<CreatorImagesDto | null>;
}
