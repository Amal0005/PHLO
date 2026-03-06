export interface DateRequest {
  date: Date;
}

export interface LeaveResponse {
  id: string;
  creatorId: string;
  date: string;
  createdAt?: string;
}

export interface ICreatorLeaveService {
  getLeaves(): Promise<LeaveResponse[]>;
  addLeave(date: Date): Promise<LeaveResponse>;
  removeLeave(date: Date): Promise<boolean>;
}
    