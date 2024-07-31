/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsString, MaxLength, MinLength, IsEmail } from 'class-validator';
import { Comment } from '../comment/comment.entity';
import { Like } from '../like/like.entity';
import { Membership } from '../membership/membership.entity';
import { Invoice } from '../invoice/invoce.entity';
import { Attachement } from '../attachement/attachement.entity';
import { Activity } from '../activity/activity.entity';
import { Weight } from '../weight/weight.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ length: 150 })
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  code: string;
  @Column({ length: 150 })
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  fullName: string;
  @Column({ length: 150 })
  @MinLength(10)
  @MaxLength(150)
  @IsEmail()
  email: string;
  @Column({ length: 15, nullable: true })
  @MinLength(8)
  @MaxLength(15)
  @IsString()
  phone: string;
  @Column({ length: 20, unique: true })
  @IsString()
  login: string;
  @Column({ select: false })
  password: string;
  @Column({ length: 150, default: 'USER' })
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  role: string;
  @OneToOne(() => Attachement, (photo) => photo.user, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'photo' })
  photo: Attachement;
  @OneToMany(() => Weight, (w) => w.user, { nullable: true })
  weight: Weight;
  @Column({ default: 0 })
  height: number;
  @Column({ nullable: true })
  dateOfBirth: Date;
  @Column({ default: true })
  enable: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
  @ManyToMany(() => Activity, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'users_activities' })
  activities: Array<Activity>;
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Array<Comment>;
  @OneToMany(() => Like, (like) => like.user)
  likes: Array<Like>;
  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Array<Membership>;
  @OneToMany(() => Invoice, (Invoice) => Invoice.user)
  invoices: Array<Invoice>;
}
