import { Exclude } from 'class-transformer';
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
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP()',
    name: 'updated_at',
  })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;
}

// Use as a BaseEntityType for all entities that use EntityId as primary key (not extended by other entities)
export abstract class ABaseEntity extends TimestampEntity {
  // @PrimaryGeneratedColumn('uuid)
  id: EntityId;
}

export abstract class UuidBaseEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // EntityId
}

export abstract class SequenceBaseEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('increment')
  id: number; // Entity
}
