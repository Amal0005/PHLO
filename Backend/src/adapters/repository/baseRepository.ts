import { IBaseRepository } from "@/domain/interface/repositories/IBaseRepository";
import { Model, Document, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T, M extends Document> implements IBaseRepository<T> {
  protected model: Model<M>;

  constructor(model: Model<M>) {
    this.model = model;
  }

  protected abstract mapToEntity(doc: any): T;

  // --- Inherited Methods provided to all repositories ---

  async create(data: Partial<T>): Promise<T> {
    const created = await this.model.create(data as any);
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findById(id);
    return result ? this.mapToEntity(result) : null;
  }

  async findAll(filter: any = {}): Promise<T[]> {
    const results = await this.model.find(filter);
    return results.map(item => this.mapToEntity(item));
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const updated = await this.model.findByIdAndUpdate(
      id,
      { $set: data } as UpdateQuery<M>,
      { new: true, runValidators: true }
    );
    return updated ? this.mapToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
