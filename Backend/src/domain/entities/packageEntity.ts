export interface PackageEntity {
  _id?: string;
  creatorId: string;
  title: string;
  description: string;
  price: number;
  category: string; 
  status: "pending" | "approved" | "rejected";
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
