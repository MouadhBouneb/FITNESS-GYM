/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne
} from 'typeorm';
import { Membership } from '../membership/membership.entity';
import { Invoice } from '../invoice/invoce.entity';

@Entity({ name: 'membership_extensions' })
export class MembershipExtension extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ default: 0 })
  length: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => Membership, (membership) => membership.membershipExtensions, {
    onDelete: 'CASCADE'
  })
  membership: Membership;
  @Column()
  membershipId: number; // Foreign key

  @OneToOne(() => Invoice, (invoice) => invoice.membershipExtension, {
    onDelete: 'CASCADE'
  })
  invoice: Invoice;
  @Column()
  invoiceId: number; // Foreign key
}
