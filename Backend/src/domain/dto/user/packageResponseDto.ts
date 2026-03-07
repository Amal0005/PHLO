export interface PackageResponseDto {
    _id: string;
    creatorId: string | {
        _id: string;
        fullName: string;
        profilePhoto?: string;
        city?: string;
    };
    title: string;
    description: string;
    price: number;
    category: string | {
        _id: string;
        name: string;
    };
    images: string[];
    locations: {
        type: "Point";
        coordinates: [number, number];
        placeName: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    distance?: number;
}
