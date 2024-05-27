import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'text' })
  comment: string;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE'
  })
  post: Post;
  @Column()
  postId: number; // Foreign key
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE'
  })
  user: User;
  @Column()
  userId: number; // Foreign key
}
