import { Repository } from 'typeorm';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { CreateMembershipRequest } from 'src/common/validators/membership-price/create';
import { UpdateMembershipRequest } from 'src/common/validators/membership/update';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>
  ) {}
  async create(createMembershipRequest: CreateMembershipRequest): Promise<Membership> {
    const createdMembership: Membership = this.membershipRepository.create(createMembershipRequest);
    return this.membershipRepository.save(createdMembership);
  }

  async update(id: number, UpdateMembershipRequest: UpdateMembershipRequest) {
    return this.membershipRepository.update(id, UpdateMembershipRequest);
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.find({
      where: {
        enable: true
      }
    });
  }
  async findById(id: number): Promise<Membership> {
    return this.membershipRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async deleteById(id: number) {
    return this.membershipRepository.delete(id);
  }
}
