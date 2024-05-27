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
import { Attachement } from '../attachement/attachement.entity';
import { Membership } from '../membership/membership.entity';
import { MembershipPrice } from '../memebership-price/membership-price.entity';

@Entity({ name: 'membership_types' })
export class MembershipType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column()
  nameFr: string;
  @Column()
  nameEn: string;
  @Column()
  nameAr: string;
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
  @ManyToOne(() => Attachement, { nullable: true, onDelete: 'CASCADE' })
  attachement: Attachement;
  @Column({ nullable: true })
  attachementId: number; // Foreign key
  @OneToMany(() => Membership, (membership) => membership.membershipType)
  memberships: Array<Membership>;
  @OneToMany(() => MembershipPrice, (membershipPrice) => membershipPrice.membershipType)
  membershipPrices: Array<MembershipPrice>;
}
