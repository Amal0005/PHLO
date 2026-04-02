
export interface ICheckAvailabilityUseCase {
    checkAvailability(packageId: string, date: Date): Promise<boolean>;
}
