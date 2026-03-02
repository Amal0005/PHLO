export interface CreateBookingRequestDTO {
  packageId: string;
  baseUrl: string;
  bookingDate: Date;
  location?: string;
}
