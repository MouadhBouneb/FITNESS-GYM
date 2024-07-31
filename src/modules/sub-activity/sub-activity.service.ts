import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubActivity } from './sub-activity.entity';
import { ActivityService } from '../activity/activity.service';
import { CreateSubActivityRequest } from 'src/common/validators/sub-activity/request/create';
import { Activity } from '../activity/activity.entity';
import { globalMessages } from 'src/utils/global-messages';
import { Language } from 'src/common/validators/language';
@Injectable()
export class SubActivityService {
  constructor(
    @InjectRepository(SubActivity)
    private readonly subActivityRepository: Repository<SubActivity>,
    private readonly activityService: ActivityService
  ) {}

  async getOne(id: number) {
    return this.subActivityRepository.findOneBy({ id: id });
  }
  async create(subActivity: CreateSubActivityRequest, language: Language): Promise<SubActivity> {
    const activity: Activity = await this.activityService.getOneEnabled(subActivity.activityId);
    if (!activity) {
      throw new HttpException(
        globalMessages[language].error.activityNotFound,
        HttpStatus.NOT_FOUND
      );
    }
    const createdSubActivity = this.subActivityRepository.create({
      duration: subActivity.duration,
      title: subActivity.title,
      activity: activity
    });
    const subAct = await this.subActivityRepository.save(createdSubActivity);
    await this.activityService.updateDuration(activity, createdSubActivity.duration, language);
    return subAct;
  }

  // async getSubActivities(activityId: number, language: Language): Promise<SubActivity[]> {

  // }
  async update(subActivity: SubActivity): Promise<SubActivity> {
    return this.subActivityRepository.save(subActivity);
  }
  async deleteSubActivity(id: number) {
    return await this.subActivityRepository.delete({ id: id });
  }
}
