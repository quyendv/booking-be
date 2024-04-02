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

  _createInstance(data: DeepPartial<T>): T {
    return this._repository.create(data);
  }

  _createOne(data: DeepPartial<T>): Promise<T> {
    return this._repository.save(data);
  }

  _createMany(dataArray: DeepPartial<T>[]): Promise<T[]> {
    return this._repository.save(dataArray);
  }

  _findById(id: EntityId, options?: FindOneOptions<T>): Promise<T | null> {
    // return this._repository.findOneBy({ id } as FindOptionsWhere<T>);
    return this._repository.findOne({ ...options, where: { id } as FindOptionsWhere<T> });
  }

  _findByIds(ids: EntityId[], options?: FindOneOptions<T>): Promise<T[]> {
    // return this._repository.findBy({ id: In(ids) } as FindOptionsWhere<T>);
    return this._repository.find({ ...options, where: { id: In(ids) } as FindOptionsWhere<T> });
  }

  _findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this._repository.findOne(options);
  }

  _findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this._repository.find(options);
  }

  _updateOne(id: EntityId, data: DeepPartial<T>): Promise<T> {
    return this._repository.save({ ...data, id });
  }

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
  ): Promise<UpdateResult> {
    return this._repository.update(criteria, partialEntity);
  }

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
  ): Promise<UpdateResult> {
    return this._repository.softDelete(criteria);
  }

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
  ): Promise<UpdateResult> {
    return this._repository.restore(criteria);
  }

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
  ): Promise<DeleteResult> {
    return this._repository.delete(criteria);
  }

  // *** Advanced: // FIXME: see findOrCreate of sequelize
  async _findOneOrCreate(data: DeepPartial<T>, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this._findOne({ ...options, where: data as any });
    if (entity) return entity;
    return this._createOne(data);
  }

  // async findOrCreate(props: {
  //   where: FindOptionsWhere<T>;
  //   defaults: DeepPartial<T>;
  // }): Promise<[T, boolean]> {
  //   const entity = await this._findOne({ where: props.where });
  //   if (entity) return [entity, false];
  //   const newEntity = await this._createOne(props.defaults);
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
