export interface UserBooking {
  id: string;
  packageId: string;
  creatorId: string;
  userDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  packageDetails?: {
    title: string;
    description: string;
    images: string[];
    price: number;
    category: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  bookingDate: string;
  location?: string;
  sessionId: string;
  checkoutUrl?: string;
}

export interface BookingListResponse {
  success: boolean;
  data: UserBooking[];
  totalCount: number;
}
