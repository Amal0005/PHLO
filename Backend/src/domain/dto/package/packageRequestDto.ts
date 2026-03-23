export interface PackageRequestDto {
  creatorId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  locations: {
    type: "Point";
    coordinates: [number, number];
    placeName: string;
  }[];
}

export type EditPackageRequestDto = Partial<PackageRequestDto>;
