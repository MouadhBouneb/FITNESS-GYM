import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne
} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { MembershipType } from '../membership-type/membership-type.entity';

@Entity({ name: 'attachements' })
export class Attachement extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column()
  name: string;
  @Column()
  mimetype: string;
  @Column()
  path: string;
  @Column({ default: null })
  alt: string;
  @Column({ default: true })
  enable: boolean;
  @OneToOne(() => User, (user) => user.photo, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE'
  })
  user: User;
  @OneToOne(() => Post, (post) => post.photo, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE'
  })
  post: Post;
  @OneToOne(() => MembershipType, (membershipType) => membershipType.attachement, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE'
  })
  memebershipType: MembershipType;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
