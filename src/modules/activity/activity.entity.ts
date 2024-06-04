import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { Plan } from '../plan/plan.entity';
import { SubActivity } from '../sub-activity/sub-activity.entity';

  @Entity({ name: 'activities' })
  export class Activity extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;
    @Column({type : 'time'})
    hour: string;
    @Column({type: 'time'})
    duration: string;
    @Column()
    title:string;
    @Column({type:'time'})
    endTime:string
    @ManyToOne(()=>Plan,(plan) => plan.data,{cascade:true ,onDelete:'CASCADE'})
    plan:Plan
    @OneToMany(()=>SubActivity , (subActivity)=>subActivity.activity,{nullable:true})
    @JoinColumn({name:'sub-activities'})
    subActivities:Array<SubActivity>
    @Column({ default: true })
    enable: boolean;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
  }
  