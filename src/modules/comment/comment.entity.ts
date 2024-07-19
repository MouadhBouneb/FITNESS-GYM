import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'text' })
  comment: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => Post, (post) => post.comments, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Post' })
  post: Post;
  @ManyToOne(() => User, (user) => user.comments, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: User;
}
