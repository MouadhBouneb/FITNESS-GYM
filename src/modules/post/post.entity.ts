import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Like } from '../like/like.entity';
import { Attachement } from '../attachement/attachement.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'varchar', length: 255 })
  content: string;
  @Column({ default: 0, nullable: true })
  numberOfLikes: number;
  @Column({ default: 0, nullable: true })
  numberOfComments: number;
  @Column({ default: true })
  enable: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToOne(() => Attachement, (photo) => photo.post, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'photo' })
  photo: Attachement;
  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true })
  comments: Array<Comment>;
  @OneToMany(() => Like, (like) => like.post, { nullable: true })
  likes: Array<Like>;
}
