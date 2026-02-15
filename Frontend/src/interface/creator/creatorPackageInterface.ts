export interface PackageData {
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  placeName?: string;
}