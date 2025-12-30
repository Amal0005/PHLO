import dotenv from "dotenv"
import mongoose from "mongoose";
dotenv.config()
const MONGO_URI = process.env.MONGO_URI || "";


export class connectDB{
   public async connect():Promise<void>{
    try {
        await mongoose.connect(MONGO_URI)
        console.log("DB Connected");
        
    } catch (error) {
        console.error("MongoDB connection error",error);
        process.exit(1)
    }
   }
}