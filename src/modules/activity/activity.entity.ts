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
  ManyToMany
} from 'typeorm';
import { Plan } from '../plan/plan.entity';
import { SubActivity } from '../sub-activity/sub-activity.entity';
import { User } from '../user/user.entity';
import { MembershipType } from '../membership-type/membership-type.entity';

@Entity({ name: 'activities' })
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column({ type: 'time' })
  hour: string;
  @Column({ type: 'time', default: () => '000000' })
  duration: string;
  @Column({ unsigned: true, type: 'int', default: 30 })
  maxParticipant: number;
  @Column()
  title: string;
  @Column({ type: 'time' })
  endTime: string;
  @ManyToOne(() => MembershipType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'membership_type' })
  membershipType: MembershipType;
  @Column({ default: () => '100' })
  weightLoss: number;
  @ManyToOne(() => Plan, (plan) => plan.data, { cascade: true, onDelete: 'CASCADE' })
  plan: Plan;
  @OneToMany(() => SubActivity, (subActivity) => subActivity.activity, { nullable: true })
  @JoinColumn({ name: 'sub-activities' })
  subActivities: Array<SubActivity>;
  @Column({ default: true })
  enable: boolean;
  @ManyToMany(() => User)
  users: Array<User>;
  @Column({ default: () => 0 })
  numberOfParticipants: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
