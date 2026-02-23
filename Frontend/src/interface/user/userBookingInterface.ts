export interface UserBooking {
  id: string;
  packageId: string;
  packageDetails?: {
    title: string;
    description: string;
    images: string[];
  };
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BookingListResponse {
  success: boolean;
  data: UserBooking[];
}
