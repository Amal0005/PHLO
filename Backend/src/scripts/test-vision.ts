import vision from "@google-cloud/vision";
import * as dotenv from "dotenv";

// Load env from the root directory
dotenv.config();

const client = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON as string)
});
async function test() {
  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Fronalpstock_big.jpg/800px-Fronalpstock_big.jpg";
  
  try {
    const [result] = await client.safeSearchDetection(imageUrl);
  } catch (error: unknown) {
    console.error("Vision API Error:", (error as Error).message);
  }
}

test();
