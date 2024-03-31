import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EntityId } from 'typeorm/repository/EntityId';

export interface IBaseService<T> {
  // Common
  createInstance(data: DeepPartial<T>): T;

  createOne(data: DeepPartial<T>): Promise<T>;

  createMany(data: DeepPartial<T>[]): Promise<T[]>;

  findById(id: EntityId, options?: FindOneOptions<T>): Promise<T | null>;

  findByIds(ids: EntityId[], options?: FindOneOptions<T>): Promise<T[]>;

  findOne(options: FindOneOptions<T>): Promise<T | null>;

  findAll(options?: FindManyOptions<T>): Promise<T[]>;

  updateOne(id: EntityId, data: DeepPartial<T>): Promise<T>; // update by id

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>; // update by ids or conditions

  softDelete(id: EntityId): Promise<UpdateResult>;

  softDeleteMany(ids: EntityId[]): Promise<UpdateResult>;

  restore(id: EntityId): Promise<UpdateResult>;

  restoreMany(ids: EntityId[]): Promise<UpdateResult>;

  permanentDelete(id: EntityId): Promise<DeleteResult>;

  permanentDeleteMany(ids: EntityId[]): Promise<DeleteResult>;

  // Special
  findOneOrCreate(data: DeepPartial<T>, options?: FindOneOptions<T>): Promise<T>;
}
