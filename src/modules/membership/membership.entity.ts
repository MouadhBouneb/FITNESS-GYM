/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from '../user/user.entity';
import { MembershipType } from '../membership-type/membership-type.entity';
import { MembershipExtension } from '../memebership-extension/membership-extension.entity';

@Entity({ name: 'memberships' })
export class Membership extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column()
  expirationDate: Date;
  @Column({nullable:true})
  barCode: string;
  @Column({ default: true })
  enable: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.memberships, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user' })
  user: User;
  @ManyToOne(() => MembershipType, (membershipType) => membershipType.memberships,{onDelete: 'CASCADE'})
  @JoinColumn({ name: 'membership_type' })
  membershipType: MembershipType;
  @OneToMany(() => MembershipExtension, (membershipExtension) => membershipExtension.membership)
  membershipExtensions: Array<MembershipExtension>;
}
