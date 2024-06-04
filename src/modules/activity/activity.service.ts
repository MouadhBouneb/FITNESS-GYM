import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm'
import { Activity } from "./activity.entity";
import { CreateActivityRequest } from "src/common/validators/activity/request/create";
import { PlanService } from "../plan/plan.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { globalMessages } from "src/utils/global-messages";
import { Plan } from "../plan/plan.entity";

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity)
        private activityRepository: Repository<Activity>,
        private readonly planService: PlanService,
    ) { }
    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCron() {
        console.log(globalMessages['en'].success.checkingForTimeOuts);
        const latestActivity = await this.activityRepository.findOne
            ({
                relations: ['plan'],
                order: {
                    plan: { date: 'DESC' },
                    hour: 'DESC'
                }, 
                where: { enable: true }
            })
            console.log(latestActivity);
        if (latestActivity) {
            const newDate = new Date()
            const timeNow = newDate.getTime()
            const activityTimeValues = latestActivity.endTime.split(':')
            let activityTime : Date = (new Date())
            activityTime.setHours(parseInt(activityTimeValues[0]))
            activityTime.setMinutes(parseInt(activityTimeValues[1]))

            console.log(timeNow, '\n', activityTime.getTime());
            if (timeNow > activityTime.getTime()) {
                latestActivity.enable = false
                this.activityRepository.save(latestActivity)
            }
        }
    }

    async create(activity: CreateActivityRequest): Promise<Activity> {
        const plan: Plan = await this.planService.getOneByDate(activity.date)
        const endTime = this.calculateEndTime(activity.hour,activity.duration)

        const createdActivity = this.activityRepository.create({
            plan: plan,
            title: activity.title,
            duration: activity.duration,
            hour:activity.hour,
            endTime:endTime
        })
        return this.activityRepository.save(createdActivity)
    }
    private calculateEndTime(sTime:string,duration:string):string{
        const startTime = sTime.split(':')
        const startHour = parseInt(startTime[0])
        const startMinute = parseInt(startTime[1])

        const durationTime = duration.split(':')
        const durationHour = parseInt(durationTime[0])
        const durationMinute = parseInt(durationTime[1])
        
        let endTimeHour = startHour+durationHour
        let endTimeMinute = startMinute+durationMinute
        if (endTimeMinute>59){
            endTimeMinute = endTimeMinute-60
            endTimeHour = endTimeHour+1
        }
        return `${endTimeHour}:${endTimeMinute}`
    }
}