export interface IGetPresignedUrlUseCase {
  execute(
    fileType: string,
    folder: string
  ): Promise<{
    uploadUrl: string;
    publicUrl: string;
  }>;
}
