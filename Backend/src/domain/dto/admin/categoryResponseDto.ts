export interface CategoryResponseDto {
    categoryId: string;
    _id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}
