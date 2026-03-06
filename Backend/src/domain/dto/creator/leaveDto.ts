export interface AddLeaveRequestDto {
  creatorId: string;
  date: Date;
}
export interface LeaveResponseDto {
  id: string;
  creatorId: string;
  date: Date;
  createdAt?: Date;
}
