import vision from "@google-cloud/vision";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function debugVision() {
  const logFile = path.join(__dirname, "../../vision-debug.txt");
  fs.writeFileSync(logFile, "Starting Vision Debug...\n");
  
  try {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    fs.appendFileSync(logFile, `Using credentials from: ${keyPath}\n`);
    
    if (keyPath && fs.existsSync(keyPath)) {
      const stats = fs.statSync(keyPath);
      fs.appendFileSync(logFile, `Key file size: ${stats.size} bytes\n`);
    } else {
      fs.appendFileSync(logFile, `ERROR: Key file NOT FOUND at ${keyPath}\n`);
    }

    const client = new vision.ImageAnnotatorClient();
    fs.appendFileSync(logFile, "Client initialized.\n");

    const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const buffer = Buffer.from(testImageBase64, "base64");

    const [result] = await client.safeSearchDetection({
      image: { content: buffer }
    });

    fs.appendFileSync(logFile, `Result received: ${JSON.stringify(result.safeSearchAnnotation)}\n`);
  } catch (err: unknown) {
    const error = err as Error;
    fs.appendFileSync(logFile, `CATCHED ERROR: ${error.message}\n`);
    if (error.stack) {
      fs.appendFileSync(logFile, `STACK: ${error.stack}\n`);
    }
  }
}

debugVision();
