export interface IPasswordService {
  compare(plain: string, hashed: string): Promise<boolean>;
  hash(password: string): Promise<string>;
}

