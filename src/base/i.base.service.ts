import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectId,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EntityId } from 'typeorm/repository/EntityId';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export interface IBaseService<T> {
  // Common
  _createInstance(data: DeepPartial<T>): T;

  _createOne(data: DeepPartial<T>): Promise<T>;

  _createMany(data: DeepPartial<T>[]): Promise<T[]>;

  _findById(id: EntityId, options?: FindOneOptions<T>): Promise<T | null>;

  _findByIds(ids: EntityId[], options?: FindOneOptions<T>): Promise<T[]>;

  _findOne(options: FindOneOptions<T>): Promise<T | null>;

  _findAll(options?: FindManyOptions<T>): Promise<T[]>;

  _updateOne(id: EntityId, data: DeepPartial<T>): Promise<T>; // update by id

  _update(
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

  _softDelete(
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
  ): Promise<UpdateResult>;

  _restore(
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
  ): Promise<UpdateResult>;

  _permanentDelete(
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
  ): Promise<DeleteResult>;

  // Special
  _findOneOrCreate(data: DeepPartial<T>, options?: FindOneOptions<T>): Promise<T>;

  _upsert(
    entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    options: UpsertOptions<T> /* | string[] */,
  ): Promise<InsertResult>;
}
