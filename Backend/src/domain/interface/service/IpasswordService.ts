export interface IpasswordService {
  compare(plain: string, hashed: string): Promise<boolean>;
  hash(password: string): Promise<string>;
}
