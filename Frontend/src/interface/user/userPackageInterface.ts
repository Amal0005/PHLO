export interface UserPackage {
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
    description?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
}


export interface PackageFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  creatorId?: string;
}

export interface PackageListResponse {
  success: boolean;
  data: UserPackage[];
  count: number;
}
