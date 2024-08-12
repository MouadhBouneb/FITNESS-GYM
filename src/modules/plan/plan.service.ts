import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './plan.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>
  ) {}

  async getOneByDate(date: string): Promise<Plan> {
    const plan = await this.planRepository.findOneBy({ date: date });
    console.log('found plan : ', plan);

    if (!plan) {
      const createPlan = this.planRepository.create({ date: date });
      console.log('created plan : ', createPlan);
      return await this.planRepository.save(createPlan);
    }
    return plan;
  }
  async getOneEnabled(id: number): Promise<Plan> {
    return await this.planRepository.findOne({
      relations: { data: true },
      where: [{ id: id }, { data: { enable: true } }]
    });
  }
  async getOneWithActivities(id: number): Promise<Plan> {
    return await this.planRepository.findOne({
      relations: { data: true },
      where: { id: id, enable: true }
    });
  }
  async disablePlan(id: number) {
    await this.planRepository.update({ id: id }, { enable: false });
  }
  async getAll() {
    const plans = await this.planRepository.find({
      relations: { data: { membershipType: true } },
      where: { enable: true, data: { enable: true } },
      order: { date: 'ASC', data: { hour: 'ASC' } }
    });

    // const plansObj: any[] = plans;
    // for (const plan of plansObj) {
    //   for (const activity of plan['activities']) {
    //   }
    // }
    return plans;
    // return await this.planRepository.query(
    //   'SELECT *,activity FROM plans p INNER JOIN activities a ON a.planId=p.id\
    //     INNER JOIN membership_types mt ON mt.id = a.membership_type\
    //     WHERE p.enable=1\
    //     ORDER BY p.date DESC  '
    // );
  }
}
