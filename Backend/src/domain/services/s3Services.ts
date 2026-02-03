import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { IStorageService } from "@/domain/interface/service/Is3Services";

export class S3StorageService implements IStorageService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    
  }

  async getPresignedUploadUrl(
    fileType: string,
    folder: string
  ): Promise<{ uploadUrl: string; publicUrl: string }> {
if (!fileType.includes('/')) {
  throw new Error('Invalid file type format. Expected format: type/subtype');
}
    const extension = fileType.split("/")[1];
    const fileName = `${folder}/${crypto.randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60,
    });


    return { uploadUrl, publicUrl:fileName };
  }
  async getSignedViewUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  });

  return getSignedUrl(this.s3, command, { expiresIn: 300 });
}
}
