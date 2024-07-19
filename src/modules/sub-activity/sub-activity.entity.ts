import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { Activity } from '../activity/activity.entity';

@Entity({ name: 'sub_activities' })
export class SubActivity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'time' })
  duration: string;
  @Column()
  title: string;
  @ManyToOne(() => Activity, (activity) => activity.subActivities, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  activity: Activity;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
