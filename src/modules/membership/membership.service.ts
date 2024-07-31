import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { UpdateMembershipRequest } from 'src/common/validators/membership/update';
import { CreateMembershipRequest } from 'src/common/validators/membership/create';
import { User } from '../user/user.entity';
import { MembershipPrice } from '../memebership-price/membership-price.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { globalMessages } from 'src/utils/global-messages';
import { use } from 'passport';
import { MembershipType } from '../membership-type/membership-type.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>
  ) {}
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    console.log(globalMessages['en'].success.checkingForMembershipTimeouts);
    const latestMembership = await this.membershipRepository.findOne({
      relations: { membershipType: true },
      order: {
        expirationDate: 'ASC'
      },
      where: { enable: true }
    });

    const membershipDate = new Date(latestMembership.expirationDate);
    const newDate = new Date();
    const timeNow = newDate.getTime();
    const membershipTime = membershipDate.getTime();

    if (timeNow > membershipTime) {
      latestMembership.enable = false;
      console.log('membership disabled', {
        id: latestMembership.id,
        name: latestMembership.membershipType.nameEn
      });
      this.membershipRepository.save(latestMembership);
    }
  }

  async create(
    createMembershipRequest: CreateMembershipRequest,
    user: User,
    membershipPrice: MembershipPrice
  ): Promise<Membership> {
    const membershipExist = await this.membershipRepository.findOne({
      relations: { membershipType: true },
      where: {
        user: { id: user.id },
        membershipType: { id: createMembershipRequest.membershipTypeId },
        enable: true
      }
    });
    console.log(membershipExist);
    console.log(membershipExist);

    if (membershipExist) {
      membershipExist.expirationDate = this.getExpirationDate(
        membershipExist.expirationDate,
        membershipPrice.length
      );
      return await membershipExist.save();
    }
    const expiDate = this.getExpirationDate(new Date(), membershipPrice.length);
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

  getExpirationDate(selectedDate: Date = new Date(), membershipLength: number): Date {
    selectedDate.setDate(selectedDate.getDate() + membershipLength);
    console.log(selectedDate);
    return selectedDate;
  }
}
