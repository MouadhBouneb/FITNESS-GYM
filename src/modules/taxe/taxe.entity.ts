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

@Entity({ name: 'taxes' })
export class Taxe extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ length: 150, unique: true })
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  code: string;
  @Column({ type: 'float' })
  value: number;
  @Column({ default: true })
  enable: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
