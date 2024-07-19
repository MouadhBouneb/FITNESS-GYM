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
  @Column({ type: 'float',default: 0 })
  discountAmount: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: User;
  @OneToOne(() => MembershipExtension, (membershipExt) => membershipExt.invoice, { onDelete: 'CASCADE' })
  @JoinColumn({name:'membership_extension'})
  membershipExtension: MembershipExtension;
  @ManyToOne(() => Taxe)
  @JoinColumn({ name: 'taxeTVA', referencedColumnName: 'code' })
  taxeTVA: Taxe;
}
