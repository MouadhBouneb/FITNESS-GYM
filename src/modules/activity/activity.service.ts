import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityRequest } from 'src/common/validators/activity/request/create';
import { PlanService } from '../plan/plan.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { globalMessages } from 'src/utils/global-messages';
import { Plan } from '../plan/plan.entity';
import { SubActivity } from '../sub-activity/sub-activity.entity';
import { UpdateActivityRequest } from 'src/common/validators/activity/request/update';
import { MembershipTypeService } from '../membership-type/membership-type.service';
import { Language } from 'src/common/validators/language';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private readonly planService: PlanService,
    private readonly membershipTypeService: MembershipTypeService
  ) {}
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    console.log(globalMessages['en'].success.checkingForTimeOuts);
    const latestActivity = await this.activityRepository.findOne({
      relations: { plan: true },
      order: {
        plan: { date: 'ASC' },
        hour: 'ASC'
      },
      where: { enable: true }
    });
    const activityDate = new Date(latestActivity.plan.date);
    if (activityDate <= new Date()) {
      const newDate = new Date();
      const timeNow = newDate.getTime();
      const activityTimeValues = latestActivity.endTime.split(':');
      const activityTime: Date = new Date();
      activityTime.setHours(parseInt(activityTimeValues[0]));
      activityTime.setMinutes(parseInt(activityTimeValues[1]));
      console.log(timeNow, activityTime.getTime());

      if (timeNow > activityTime.getTime()) {
        latestActivity.enable = false;
        console.log('activity disabled', { id: latestActivity.id, name: latestActivity.title });
        await this.checkIfPlanHasActivity(latestActivity.plan.id);
        this.activityRepository.save(latestActivity);
      }
    }
  }

  async create(activity: CreateActivityRequest, language: Language): Promise<Activity> {
    const notExistMembershipType = await this.verifyMembershipTypeNotExist(
      activity.membershipTypeId
    );
    if (notExistMembershipType) {
      throw new HttpException(
        globalMessages[language].error.noMembershiptTypeWithGivenId,
        HttpStatus.BAD_REQUEST
      );
    }

    const plan: Plan = await this.planService.getOneByDate(activity.date);
    const endTime = activity.hour;

    const createdActivity = this.activityRepository.create({
      plan: plan,
      title: activity.title,
      hour: activity.hour,
      endTime: endTime,
      membershipType: { id: activity.membershipTypeId }
    });
    return this.activityRepository.save(createdActivity);
  }
  async update(activityUpdateReq: UpdateActivityRequest) {
    return await this.activityRepository.update(activityUpdateReq.id, { ...activityUpdateReq });
  }

  async updateDuration(activity: Activity, addedDuration: string, language: Language) {
    const oldDurationVals = activity.duration.split(':');
    const addedDurationVals = addedDuration.split(':');
    let newHours = parseInt(oldDurationVals[0]) + parseInt(addedDurationVals[0]);
    let newMinutes = parseInt(oldDurationVals[1]) + parseInt(addedDurationVals[1]);
    let hourString = '';
    let minuteString = '';
    if (newMinutes > 59) {
      newMinutes = newMinutes - 60;
      newHours = newHours + 1;
    }
    if (newHours > 98)
      throw new HttpException(
        globalMessages[language].error.invalidHourValue,
        HttpStatus.BAD_REQUEST
      );
    if (newHours < 10) hourString = `0${newHours}`;
    else hourString = `${newHours}`;

    if (newMinutes < 10) minuteString = `0${newMinutes}`;
    else minuteString = `${newMinutes}`;
    const newDurationVal = hourString + ':' + minuteString;
    const endTime = this.calculateEndTime(activity.hour, newDurationVal);
    console.log(newDurationVal, endTime);

    const updatedActivity = await this.activityRepository.update(
      { id: activity.id },
      {
        duration: newDurationVal,
        endTime: endTime
      }
    );
    console.log(updatedActivity.raw, updatedActivity.affected);

    return;
  }
  private async verifyMembershipTypeNotExist(membershipTypeId: number) {
    const membershipType = await this.membershipTypeService.findById(membershipTypeId);
    if (!membershipType) return true;
    return false;
  }
  private calculateEndTime(sTime: string, duration: string): string {
    const startTime = sTime.split(':');
    const startHour = parseInt(startTime[0]);
    const startMinute = parseInt(startTime[1]);

    const durationTime = duration.split(':');
    const durationHour = parseInt(durationTime[0]);
    const durationMinute = parseInt(durationTime[1]);

    let endTimeHour = startHour + durationHour;
    let endTimeMinute = startMinute + durationMinute;
    if (endTimeMinute > 59) {
      endTimeMinute = endTimeMinute - 60;
      endTimeHour = endTimeHour + 1;
    }
    return `${endTimeHour}:${endTimeMinute}`;
  }
  async getOne(id: number) {
    return this.activityRepository.findOneBy({ id: id });
  }
  async getOneEnabled(id: number) {
    return this.activityRepository.findOne({ where: { id: id, enable: true } });
  }
  async getOneEnabledWithMembershipType(id: number) {
    return this.activityRepository.findOne({
      relations: { membershipType: true },
      where: { id: id, enable: true }
    });
  }
  async getOneWithPlan(id: number) {
    return this.activityRepository.findOne({
      relations: { plan: true },
      where: { id: id }
    });
  }
  async getSubActivities(id: number): Promise<SubActivity[]> {
    const activity = await this.activityRepository.findOne({
      where: { id: id },
      relations: { subActivities: true }
    });
    return activity?.subActivities;
  }
  async deleteActivity(id: number) {
    const activity = await this.getOneWithPlan(id);
    await this.activityRepository.delete({ id: id });
    this.checkIfPlanHasActivity(activity.plan.id);
    return activity;
  }
  async checkIfPlanHasActivity(id: number) {
    const plan = await this.planService.getOneWithActivities(id);
    if (!plan.data || plan?.data?.length <= 0) {
      this.planService.disablePlan(id);
    }
    return false;
  }
  async updateMemberCount(activity: Activity) {
    const participantsCount = activity.numberOfParticipants + 1;
    //Check for max participants if added
    return await this.activityRepository.update(
      { id: activity.id },
      { numberOfParticipants: participantsCount }
    );
  }
}
