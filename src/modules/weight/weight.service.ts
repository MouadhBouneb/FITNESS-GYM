import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Weight } from './weight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { globalMessages } from 'src/utils/global-messages';
import { Language } from 'src/common/validators/language';

@Injectable()
export class WeightService {
  constructor(
    @InjectRepository(Weight)
    private readonly weightRepository: Repository<Weight>
  ) {}

  async getUserWeight(user_id: number) {
    const weight = await this.weightRepository.findOne({
      relations: { user: true },
      where: { user: { id: user_id } },
      order: { createdAt: 'DESC' }
    });
    if (!weight) {
      throw new HttpException('Weight not found', HttpStatus.NOT_FOUND);
    }
    return weight;
  }

  async setUserWeight(user_id: number, value: number) {
    const weight = this.weightRepository.create({ user: { id: user_id }, value: value });
    return this.weightRepository.save(weight);
  }

  async getLastMonthWeight(user_id: number, language: Language) {
    const lastMonth = new Date(new Date().setMonth(new Date().getDay() - 30));
    // const weight = await this.weightRepository.find({
    //   relations: { user: true },
    //   where: { user: { id: user_id }, createdAt: MoreThan(lastMonth) },
    //   order: { createdAt: 'DESC' }
    // });
    const weight = await this.weightRepository.query(
      `
      SELECT w.value, DAY(w.createdAt) as day
      FROM weights w
      JOIN (
        SELECT DAY(createdAt) as day, MAX(createdAt) as max_createdAt
        FROM weights as w
        WHERE w.user = ${user_id} AND w.createdAt > "${lastMonth}" 
        GROUP BY DAY(createdAt)
      ) sub
      ON DAY(w.createdAt) = sub.day AND w.createdAt = sub.max_createdAt
      WHERE w.user = ${user_id} AND w.createdAt > "${lastMonth}" 
      ORDER BY w.createdAt DESC
      `
    );
    // if (!weight || weight?.length === 0) {
    //   throw new HttpException(globalMessages[language].error.noWeight, HttpStatus.NOT_FOUND);
    // }
    console.log(weight);
    return weight;
  }
}
