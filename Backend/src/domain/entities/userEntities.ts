export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?:string;
  password?: string;
  provider?: "local" | "google";
}
