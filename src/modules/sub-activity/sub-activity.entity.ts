import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne
  } from 'typeorm';
import { Plan } from '../plan/plan.entity';
import { Activity } from '../activity/activity.entity';

  @Entity({ name: 'subActivities' })
  export class SubActivity extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;
    @Column({type : 'time'})
    hour: string;
    @Column()
    duration: string;
    @ManyToOne(()=>Activity,(activity) => activity.subActivities,{cascade:true, onDelete: 'CASCADE'})
    activity:Activity
    @Column({ default: true })
    enable: boolean;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
  }