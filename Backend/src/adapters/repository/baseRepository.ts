import { IBaseRepository } from "@/domain/interface/repositories/IBaseRepository";
import { Model, Document, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T, M extends Document>
  implements IBaseRepository<T>
{
  protected model: Model<M>;

  constructor(model: Model<M>) {
    this.model = model;
  }

  protected abstract mapToEntity(doc: M): T;

  // --- Common CRUD Methods ---

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    const saved = await doc.save();
    return this.mapToEntity(saved);
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findById(id).exec();
    return result ? this.mapToEntity(result) : null;
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<T[]> {
    const results = await this.model.find(filter as any).exec();
    return results.map((doc) => this.mapToEntity(doc));
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const updated = await this.model
      .findByIdAndUpdate(
        id,
        { $set: data } as UpdateQuery<M>,
        { new: true, runValidators: true }
      )
      .exec();

    return updated ? this.mapToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
