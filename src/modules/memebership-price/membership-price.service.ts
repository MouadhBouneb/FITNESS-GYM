import { Repository } from 'typeorm';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipPrice } from './membership-price.entity';
import { UpdateMembershipPriceRequest } from 'src/common/validators/membership-price/update';
import { MembershipTypeService } from '..//membership-type/membership-type.service';
import { CreateMembershipPriceRequest } from 'src/common/validators/membership-price/create';

@Injectable()
export class MembershipPriceService {
  constructor(
    @InjectRepository(MembershipPrice)
    private MembershipPriceRepository: Repository<MembershipPrice>,
    private readonly membershipTypeService: MembershipTypeService
  ) {}

  async create(CreateMembershipRequest: CreateMembershipPriceRequest): Promise<MembershipPrice> {
    const memberShipType = await this.membershipTypeService.findById(
      CreateMembershipRequest.membershipTypeId
    );
    const createdMembershipPrice: MembershipPrice = this.MembershipPriceRepository.create({
      ...CreateMembershipRequest,
      membershipType: memberShipType
    });
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
