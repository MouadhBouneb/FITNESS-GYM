import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipType } from './membership-type.entity';
import { CreateMembershipTypeRequest } from 'src/common/validators/membership-type/request/create';
import { UpdateMembershipTypeRequest } from 'src/common/validators/membership-type/request/update';

@Injectable()
export class MembershipTypeService {
  constructor(
    @InjectRepository(MembershipType)
    private membershipTypeRepository: Repository<MembershipType>
  ) {}

  async create(createMembershipTypeRequest: CreateMembershipTypeRequest): Promise<MembershipType> {
    const createdMembershipType: MembershipType = this.membershipTypeRepository.create(
      createMembershipTypeRequest
    );
    return this.membershipTypeRepository.save(createdMembershipType);
  }

  async update(id: number, UpdateMembershipTypeRequest: UpdateMembershipTypeRequest) {
    return this.membershipTypeRepository.update(id, UpdateMembershipTypeRequest);
  }

  async findAll(): Promise<MembershipType[]> {
    return this.membershipTypeRepository.find({
      where: {
        enable: true
      }
    });
  }
  async findById(id: number): Promise<MembershipType> {
    return this.membershipTypeRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async deleteById(id: number) {
    return this.membershipTypeRepository.delete(id);
  }
}
