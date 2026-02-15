export interface PackageEntity {
  _id?: string;
  creatorId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  placeName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
