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

@Entity({ name: 'attachements' })
export class Attachement extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column()
  name: string;
  @Column()
  extension: string;
  @Column()
  path: string;
  @Column({default: null})
  alt: string;
  @Column({ default: true })
  enable: boolean;
  @OneToOne(()=>User, (user) => user.photo,{
    nullable:true,
  })
  user:User
  @OneToOne(()=>Post, (post) =>post.photo,{
    nullable:true,
  })
  post:Post
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
