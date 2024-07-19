/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,

} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity({ name: 'likes' })
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.likes, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user' })
  user: User;
  @ManyToOne(() => Post, (post) => post.likes, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'post' })
  post: Post;
}
