// export interface User {
//   _id?: string;
//   name: string;
//   email: string;
//   phone?: string;
//   password?: string;
//   status: "active" | "blocked";
//   role: "user" | "creator" | "admin";
//   googleVerified: boolean;
//   lastLogin?: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }


export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?:string
  googleId?: string;
  image?: string;
    status: "active" | "blocked";
  role: "user" | "admin";
  googleVerified: boolean;
  createdAt?: Date;
}