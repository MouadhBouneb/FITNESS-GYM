import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembershipType } from './membership-type.entity';
import { CreateMembershipTypeRequest } from 'src/common/validators/membership-type/request/create';
import { UpdateMembershipTypeRequest } from 'src/common/validators/membership-type/request/update';
import { AttachementService } from '../attachement/attachement.service';
import { globalMessages } from 'src/utils/global-messages';
import { Language } from 'src/common/validators/language';

@Injectable()
export class MembershipTypeService {
  constructor(
    @InjectRepository(MembershipType)
    private membershipTypeRepository: Repository<MembershipType>,
    private readonly attachmentService: AttachementService
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
  async findAllWithoutImages(language: Language) {
    const membershipTypes = await this.membershipTypeRepository.find({
      relations: { membershipPrices: true, attachement: true },
      where: {
        enable: true
      }
    });
    if (!membershipTypes || !(membershipTypes.length > 0)) {
      throw new HttpException(globalMessages[language].error.noPostsFound, HttpStatus.BAD_REQUEST);
    }
    return membershipTypes;
  }

  async findAll(language: Language) {
    const membershipTypes = await this.membershipTypeRepository.find({
      relations: { membershipPrices: true, attachement: true },
      where: {
        enable: true
      }
    });
    if (!membershipTypes || !(membershipTypes.length > 0)) {
      throw new HttpException(globalMessages[language].error.noPostsFound, HttpStatus.BAD_REQUEST);
    }
    const data = membershipTypes as Array<any>;
    for (const el of data) {
      el['photo'] = await this.attachmentService.getBase64File(el['attachement']);
    }
    return data;
  }
  async getPhoto(id: number): Promise<string> {
    const membershipType = await this.membershipTypeRepository.findOne({
      relations: { attachement: true },
      where: { id: id }
    });
    return await this.attachmentService.getBase64File(membershipType.attachement);
  }
  async findById(id: number): Promise<MembershipType> {
    return this.membershipTypeRepository.findOne({
      where: {
        id: id
      }
    });
  }
  async setPhoto(language: string, memberShipType: MembershipType, photo: Express.Multer.File) {
    if (memberShipType.attachement) {
      this.attachmentService.deleteImage(memberShipType.attachement);
    }
    memberShipType.attachement = await this.attachmentService.createMembershipTypeImage(
      memberShipType.id,
      photo
    );
    if (!memberShipType.attachement) {
      throw new HttpException(
        globalMessages[language].error.modificationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    await this.membershipTypeRepository.update(memberShipType.id, {
      attachement: memberShipType.attachement
    });
    return memberShipType.attachement;
  }

  async deleteById(id: number) {
    return this.membershipTypeRepository.delete(id);
  }
  async getMembershipPrices(id: number) {
    return this.membershipTypeRepository.findOne({
      relations: { membershipPrices: true },
      where: { id: id }
    });
  }
}
