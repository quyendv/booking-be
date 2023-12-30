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

export abstract class ABaseEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: EntityId;
}
