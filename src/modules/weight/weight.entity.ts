import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'weights' })
export class Weight extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'float' })
  value: number;
  @ManyToOne(() => User, (user) => user.weight, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: User;
  @CreateDateColumn()
  createdAt: Date;
}
