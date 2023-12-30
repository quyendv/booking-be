import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  ObjectId,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { EntityId } from 'typeorm/repository/EntityId';
import { ABaseEntity } from './a.base.entity';
import { IBaseService } from './i.base.service';

export abstract class BaseService<T extends ABaseEntity> implements IBaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  createInstance(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  createOne(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }

  createMany(dataArray: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.save(dataArray);
  }

  findById(id: EntityId, options?: FindOneOptions<T>): Promise<T | null> {
    // return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
    return this.repository.findOne({ ...options, where: { id } as FindOptionsWhere<T> });
  }

  findByIds(ids: EntityId[], options?: FindOneOptions<T>): Promise<T[]> {
    // return this.repository.findBy({ id: In(ids) } as FindOptionsWhere<T>);
    return this.repository.find({ ...options, where: { id: In(ids) } as FindOptionsWhere<T> });
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  updateOne(id: EntityId, data: DeepPartial<T>): Promise<T> {
    return this.repository.save({ ...data, id });
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
    return this.repository.update(criteria, partialEntity);
  }

  softDelete(id: EntityId): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }

  restore(id: EntityId): Promise<UpdateResult> {
    return this.repository.restore(id);
  }

  permanentDelete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
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

  // Find by conflict path; if not exist then create; else update IF CHANGED
  // upsertEntities(
  //   entityOrEntities: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
  //   conflictPaths: string[],
  // ): Promise<InsertResult> {
  //   return this.repository.upsert(entityOrEntities, {
  //     conflictPaths,
  //     skipUpdateIfNoValuesChanged: true,
  //   });
  // }
}
