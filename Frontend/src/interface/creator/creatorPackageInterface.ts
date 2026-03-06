export interface PackageData {
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  locations: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
    placeName: string;
  }[];
}
