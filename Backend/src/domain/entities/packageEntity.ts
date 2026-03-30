import type { CreatorEntity } from "@/domain/entities/creatorEntities";

export interface PackageEntity {
  _id?: string;
  creatorId: string | CreatorEntity;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  locations: {
    type: "Point";
    coordinates: [number, number];
    placeName: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
