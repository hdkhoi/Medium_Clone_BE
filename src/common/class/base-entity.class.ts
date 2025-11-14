import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  // @Exclude()
  @CreateDateColumn()
  created_at: Date;

  // @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
