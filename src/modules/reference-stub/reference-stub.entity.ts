/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';
import { IsString, MaxLength, MinLength } from 'class-validator';

@Entity({ name: 'reference_stubs' })
export class ReferenceStub extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ length: 150 })
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  code: string;
  @Column({ default: 0 })
  numberOfDigit: number;
  @Column({ default: 0 })
  value: number;
  @Column({ default: true })
  enable: boolean;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
