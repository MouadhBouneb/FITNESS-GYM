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
  @Column({ default: true })
  enable: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => Attachement, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'background_image' })
  attachement: Attachement;
  @OneToMany(() => Membership, (membership) => membership.membershipType)
  memberships: Array<Membership>;
  @OneToMany(() => MembershipPrice, (membershipPrice) => membershipPrice.membershipType)
  membershipPrices: Array<MembershipPrice>;
}
