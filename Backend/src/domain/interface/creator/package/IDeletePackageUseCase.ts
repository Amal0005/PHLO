export interface IDeletePackageUseCase {
  deletePackage(packageId: string, creatorId: string): Promise<void>;
}
