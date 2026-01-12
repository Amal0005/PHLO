export interface IStorageService {
  getPresignedUploadUrl(
    fileType: string,
    folder: string
  ): Promise<{
    uploadUrl: string;
    publicUrl: string;
  }>;
    getSignedViewUrl(key: string): Promise<string>;

}