/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany
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
  @Column()
  barCode: string;
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

  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE'
  })
  user: User;
  @Column()
  userId: number; // Foreign key
  @ManyToOne(() => MembershipType, (membershipType) => membershipType.memberships, {
    onDelete: 'CASCADE'
  })
  membershipType: MembershipType;
  @Column()
  membershipTypeId: number; // Foreign key
  @OneToMany(() => MembershipExtension, (membershipExtension) => membershipExtension.membership)
  membershipExtensions: Array<MembershipExtension>;
}
