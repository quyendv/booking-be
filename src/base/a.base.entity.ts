import { Exclude, Expose } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityId } from 'typeorm/repository/EntityId';

export abstract class TimestampEntity {
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP()',
    name: 'created_at',
  })
  // @Exclude({ toPlainOnly: true })
  @Expose({ name: 'createdAt', groups: ['timestamptz', 'created'] })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP()',
    name: 'updated_at',
  })
  // @Exclude({ toPlainOnly: true })
  @Expose({ name: 'updatedAt', groups: ['timestamptz', 'updated'] })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  // @Exclude({ toPlainOnly: true })
  @Expose({ name: 'deletedAt', groups: ['timestamptz', 'deleted'] })
  deletedAt: Date;
}

// Use as a BaseEntityType for all entities that use EntityId as primary key
export abstract class ABaseEntity extends TimestampEntity {
  // @PrimaryGeneratedColumn('uuid)
  id: EntityId;
}

export class UuidBaseEntity extends ABaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // EntityId
}

export class SequenceBaseEntity extends ABaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number; // EntityId
}
