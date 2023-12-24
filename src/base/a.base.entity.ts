import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityId } from 'typeorm/repository/EntityId';

export abstract class ABaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: EntityId;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP()' })
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP()' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;
}

export abstract class TimestampEntity {
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP()' })
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP()' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;
}
