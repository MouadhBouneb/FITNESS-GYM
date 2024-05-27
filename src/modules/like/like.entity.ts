/* eslint-disable prettier/prettier */

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column
} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity({ name: 'likes' })
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE'
  })
  user: User;
  @Column()
  userId: number; // Foreign key
  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE'
  })
  post: Post;
  @Column()
  postId: number; // Foreign key
}
