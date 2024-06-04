import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  AfterUpdate,
  JoinColumn
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Like } from '../like/like.entity';
import { Attachement } from '../attachement/attachement.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'text' })
  title: string;
  @Column({ type: 'text' })
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
  @OneToOne(() => Attachement, (photo) => photo.post, { nullable: true})
  @JoinColumn({ name: 'photo' })
  photo: Attachement
  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true})
  @JoinColumn({ name: 'comments' })
  comments: Array<Comment>;
  @OneToMany(() => Like, (like) => like.post, { nullable: true})
  @JoinColumn({ name: 'likes' })
  likes: Array<Like>;
  @AfterUpdate()
  updateNumberOfLikes() {
    if (this.likes) this.numberOfLikes = this.likes?.length;
  }
  @AfterUpdate()
  updateNumberOfComments() {
    if (this.comments) this.numberOfComments = this.comments.length;
  }
}
