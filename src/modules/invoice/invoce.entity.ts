/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../user/user.entity';
import { MembershipExtension } from '../memebership-extension/membership-extension.entity';
import { Taxe } from '../taxe/taxe.entity';

@Entity({ name: 'invoices' })
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column()
  code: string;
  @Column({ type: 'float' })
  totalTTC: number;
  @Column({ type: 'float' })
  totalHT: number;
  @Column({ type: 'float' })
  discountAmount: number;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.invoices, {
    onDelete: 'CASCADE'
  })
  user: User;
  @Column()
  userId: number; // Foreign key
  @OneToOne(() => MembershipExtension, (membershipExtension) => membershipExtension.invoice, {
    onDelete: 'CASCADE'
  })
  membershipExtension: MembershipExtension;
  @Column()
  membershipExtensionId: number; // Foreign key
  @ManyToOne(() => Taxe)
  @JoinColumn({ name: 'taxeTVA', referencedColumnName: 'code' })
  taxeTVA: Taxe;
}
