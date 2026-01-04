export interface IPendingUserService {
  getPending(email: string): Promise<string | null>;
  deletePending(email: string): Promise<void>;
}
