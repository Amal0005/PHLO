export interface UserDto {
  _id?: string;
  name: string;
  phone?:string
  email: string;
  password: string;
  provider?: "local" | "google";

}