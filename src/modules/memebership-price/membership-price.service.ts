import { Repository } from 'typeorm';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipPrice } from './membership-price.entity';
import { CreateMembershipPriceRequest } from 'src/common/validators/membership-price/create';
import { UpdateMembershipPriceRequest } from 'src/common/validators/membership-price/update';

@Injectable()
export class MembershipPriceService {
  constructor(
    @InjectRepository(MembershipPrice)
    private MembershipPriceRepository: Repository<MembershipPrice>
  ) {}

  async create(
    createMembershipPriceRequest: CreateMembershipPriceRequest
  ): Promise<MembershipPrice> {
    const createdMembershipPrice: MembershipPrice = this.MembershipPriceRepository.create(
      createMembershipPriceRequest
    );
    return this.MembershipPriceRepository.save(createdMembershipPrice);
  }

  async update(id: number, UpdateMembershipPriceRequest: UpdateMembershipPriceRequest) {
    return this.MembershipPriceRepository.update(id, UpdateMembershipPriceRequest);
  }

  async findAll(): Promise<MembershipPrice[]> {
    return this.MembershipPriceRepository.find({
      where: {
        enable: true
      }
    });
  }
  async findById(id: number): Promise<MembershipPrice> {
    return this.MembershipPriceRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async deleteById(id: number) {
    return this.MembershipPriceRepository.delete(id);
  }
}
