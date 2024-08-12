import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Activity } from '../activity/activity.entity';

@Entity({ name: 'plans' })
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'date' })
  date: string;
  @OneToMany(() => Activity, (like) => like.plan, { nullable: true })
  @JoinColumn({ name: 'Activity' })
  data: Array<Activity>;
  @Column({ default: true })
  enable: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
