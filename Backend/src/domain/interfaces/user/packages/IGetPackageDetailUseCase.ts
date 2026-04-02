import type { PackageResponseDto } from "@/domain/dto/user/packageResponseDto";

export interface IGetPackageDetailUseCase {
  getPackageById(packageId: string): Promise<PackageResponseDto | null>;
}