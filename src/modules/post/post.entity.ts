import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Like } from '../like/like.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'text' })
  text: string;
  @Column({ default: 0 })
  numberOfLikes: number;
  @Column({ default: 0 })
  numberOfComments: number;
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
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Array<Comment>;
  @OneToMany(() => Like, (like) => like.post)
  likes: Array<Like>;
}
