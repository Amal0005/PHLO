export interface IRedisService {
  setValue(key: string, value: string, expiresInSeconds?: number): Promise<void>;
  getValue(key: string): Promise<string | null>;
  deleteValue(key: string): Promise<void>;
}
