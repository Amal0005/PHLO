export interface ReviewResponseDTO {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  packageId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
