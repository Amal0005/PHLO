export interface IGetPresignedViewUrlUseCase {
  execute(key: string): Promise<string>;
}

