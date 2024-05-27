/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { MembershipType } from '../membership-type/membership-type.entity';

@Entity({ name: 'membership_prices' })
export class MembershipPrice extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'float' })
  price: number;
  @Column()
  length: number;
  @Column({ default: 0 })
  discount: number;
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
  @ManyToOne(() => MembershipType, (membershipType) => membershipType.membershipPrices, {
    onDelete: 'CASCADE'
  })
  membershipType: MembershipType;
  @Column()
  membershipTypeId: number; // Foreign key
}
