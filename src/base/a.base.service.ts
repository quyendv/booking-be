import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  InsertResult,
  ObjectId,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EntityId } from 'typeorm/repository/EntityId';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { ABaseEntityWithoutTimestamp } from './a.base.entity';
import { IBaseService } from './i.base.service';

export abstract class BaseService<T extends ABaseEntityWithoutTimestamp>
  implements IBaseService<T>
{
  constructor(private readonly _repository: Repository<T>) {}

  createInstance(data: DeepPartial<T>): T {
    return this._repository.create(data);
  }

  createOne(data: DeepPartial<T>): Promise<T> {
    return this._repository.save(data);
  }

  createMany(dataArray: DeepPartial<T>[]): Promise<T[]> {
    return this._repository.save(dataArray);
  }

  findById(id: EntityId, options?: FindOneOptions<T>): Promise<T | null> {
    // return this._repository.findOneBy({ id } as FindOptionsWhere<T>);
    return this._repository.findOne({ ...options, where: { id } as FindOptionsWhere<T> });
  }

  findByIds(ids: EntityId[], options?: FindOneOptions<T>): Promise<T[]> {
    // return this._repository.findBy({ id: In(ids) } as FindOptionsWhere<T>);
    return this._repository.find({ ...options, where: { id: In(ids) } as FindOptionsWhere<T> });
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this._repository.findOne(options);
  }

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this._repository.find(options);
  }

  updateOne(id: EntityId, data: DeepPartial<T>): Promise<T> {
    return this._repository.save({ ...data, id });
  }

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
  ): Promise<UpdateResult> {
    return this._repository.update(criteria, partialEntity);
  }

  softDelete(id: EntityId): Promise<UpdateResult> {
    return this._repository.softDelete(id);
  }

  softDeleteMany(ids: EntityId[]): Promise<UpdateResult> {
    return this._repository.softDelete(ids as any);
  }

  restore(id: EntityId): Promise<UpdateResult> {
    return this._repository.restore(id);
  }

  restoreMany(ids: EntityId[]): Promise<UpdateResult> {
    return this._repository.restore(ids as any);
  }

  delete(
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
  ): Promise<DeleteResult> {
    return this._repository.delete(criteria);
  }

  permanentDelete(id: EntityId): Promise<DeleteResult> {
    return this._repository.delete(id);
  }

  permanentDeleteMany(ids: EntityId[]): Promise<DeleteResult> {
    return this._repository.delete(ids as any);
  }

  // *** Advanced: // FIXME: see findOrCreate of sequelize
  async findOneOrCreate(data: DeepPartial<T>, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.findOne({ ...options, where: data as any });
    if (entity) return entity;
    return this.createOne(data);
  }

  // async findOrCreate(props: {
  //   where: FindOptionsWhere<T>;
  //   defaults: DeepPartial<T>;
  // }): Promise<[T, boolean]> {
  //   const entity = await this.findOne({ where: props.where });
  //   if (entity) return [entity, false];
  //   const newEntity = await this.createOne(props.defaults);
  //   return [newEntity, true];
  // }

  _upsert(
    entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    options: UpsertOptions<T> /* | string[] */,
  ): Promise<InsertResult> {
    return this._repository.upsert(entityOrEntities, {
      skipUpdateIfNoValuesChanged: true,
      ...options,
    });
  }
}
