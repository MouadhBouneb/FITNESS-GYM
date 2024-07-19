import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { UpdateMembershipRequest } from 'src/common/validators/membership/update';
import { CreateMembershipRequest } from 'src/common/validators/membership/create';
import { User } from '../user/user.entity';
import { MembershipPrice } from '../memebership-price/membership-price.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>
  ) {}
  async create(
    createMembershipRequest: CreateMembershipRequest,
    user: User,
    membershipPrice: MembershipPrice
  ): Promise<Membership> {
    const expiDate = this.getExpirationDate(membershipPrice.length);
    const createdMembership: Membership = this.membershipRepository.create({
      membershipType: { id: createMembershipRequest.membershipTypeId },
      expirationDate: expiDate,
      user: user,
      enable: createMembershipRequest.enable
    });
    return this.membershipRepository.save(createdMembership);
  }

  async update(id: number, UpdateMembershipRequest: UpdateMembershipRequest) {
    return this.membershipRepository.update(id, UpdateMembershipRequest);
  }

  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.find({
      relations: ['membershipPrice', 'membershipType'],
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

  getExpirationDate(membershipLength: number): Date {
    const date = new Date();
    console.log(date);
    date.setDate(date.getDate() + membershipLength);
    console.log(date);
    return date;
  }
}
