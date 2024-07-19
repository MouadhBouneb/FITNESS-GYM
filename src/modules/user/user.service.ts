import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserRequest } from '../../common/validators/user/request/create';
import { UpdateUserRequest } from '../../common/validators/user/request/update';
import { globalMessages } from 'src/utils/global-messages';
import { AttachementService } from '../attachement/attachement.service';
import { Membership } from '../membership/membership.entity';
import { ActivityService } from '../activity/activity.service';
import { Language } from 'src/common/validators/language';
import { WeightService } from '../weight/weight.service';
import { Weight } from '../weight/weight.entity';
import { Activity } from '../activity/activity.entity';
import * as bcrypt from 'bcrypt';
import { MembershipType } from '../membership-type/membership-type.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly weightService: WeightService,
    private readonly attachmentService: AttachementService,
    private readonly activityService: ActivityService
  ) {}

  async GetOne(id: number) {
    const user = await this.userRepository.findOne({
      relations: { weight: true },
      where: {
        id: id
      }
    });
    return user;
  }

  async GetOneWithPhoto(id: number) {
    const user = await this.userRepository.findOne({
      relations: { photo: true },
      where: {
        id: id
      }
    });
    return user;
  }
  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email
      }
    });
    return user;
  }
  async getByLogin(login: string) {
    const user = await this.userRepository.findOne({
      relations: { weight: true },
      select: {
        activities: true,
        email: true,
        fullName: true,
        id: true,
        login: true,
        password: true,
        enable: true,
        role: true,
        height: true,
        weight: { value: true }
      },
      where: {
        login: login
      }
    });
    return user;
  }
  async GetAll() {
    const users = await this.userRepository.find();
    return users;
  }
  async create(language: string, createUserRequest: CreateUserRequest) {
    try {
      const verifemail = await this.userRepository.findOneBy({
        login: createUserRequest.login.toLowerCase()
      });
      if (verifemail) {
        throw new HttpException(
          globalMessages[language].error.loginAlreadyUsed,
          HttpStatus.BAD_REQUEST
        );
      }
      const createUser = {
        fullName: createUserRequest.fullName,
        email: createUserRequest.email,
        role: createUserRequest.role,
        adresse: createUserRequest.adresse,
        login: createUserRequest.login,
        code: createUserRequest.code,
        phone: createUserRequest.phone,
        password: createUserRequest.password,
        height: createUserRequest.height,
        dateOfBirth: createUserRequest.dateOfBirth,
        weight: null
      };
      const user = this.userRepository.create({ ...createUser });

      createUserRequest.weight
        ? await this.weightService.setUserWeight(user.id, createUserRequest.weight)
        : null;

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new HttpException(
        globalMessages[language].error.registrationFailed,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async update(language: string, id: number, updateUserRequest: UpdateUserRequest) {
    try {
      const user = await this.userRepository.findOne({
        select: { password: true },
        where: { id: id }
      });
      if (!user) {
        throw new HttpException(
          globalMessages[language].error.userNotFound,
          HttpStatus.BAD_REQUEST
        );
      }
      const verifemail = await this.userRepository.findOne({
        where: {
          login: updateUserRequest.email,
          id: Not(id)
        }
      });
      if (verifemail) {
        throw new HttpException(
          globalMessages[language].error.loginAlreadyUsed,
          HttpStatus.BAD_REQUEST
        );
      }
      const updateUser: any = {
        fullName: updateUserRequest.fullName,
        email: updateUserRequest.email,
        role: updateUserRequest.role,
        adresse: updateUserRequest.adresse,
        login: updateUserRequest.login,
        phone: updateUserRequest.phone,
        height: updateUserRequest.height,
        dateOfBirth: updateUserRequest.dateOfBirth
      };
      if (updateUserRequest.password) {
        const isPasswordMatching = await bcrypt.compare(updateUserRequest.password, user.password);
        if (!isPasswordMatching) {
          const salt = await bcrypt.genSalt();
          updateUser.password = await bcrypt.hash(
            updateUserRequest.password || user.password,
            salt
          );
        }
      }
      if (updateUserRequest.weight)
        await this.weightService.setUserWeight(id, updateUserRequest.weight);
      const userupdate = await this.userRepository.update({ id }, { ...updateUser });
      return userupdate.affected == 0 ? false : true;
    } catch (error) {
      throw new HttpException(
        globalMessages[language].error.modificationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async setPhoto(language: string, user: User, photo: Express.Multer.File) {
    if (user.photo !== null || user.photo !== undefined) {
      this.attachmentService.deleteImage(user.photo);
      user.photo = null;
    }
    user.photo = await this.attachmentService.createUserImage(user.id, photo);
    if (!user.photo) {
      throw new HttpException(
        globalMessages[language].error.modificationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    await this.userRepository.update(user.id, { photo: user.photo });
    const base64 = await this.attachmentService.getBase64File(photo);
    return base64;
  }
  async getPhoto(language: string, id: number) {
    const user = await this.userRepository.findOne({ relations: ['photo'], where: { id: id } });
    if (!user) {
      throw new HttpException(globalMessages[language].error.userNotFound, HttpStatus.BAD_REQUEST);
    }
    const photo = await this.attachmentService.getBase64File(user.photo);
    return photo;
  }
  async delete(language: string, id: number) {
    try {
      const userdeleted = await this.userRepository.delete({ id: id });
      return userdeleted.affected == 0 ? false : true;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        globalMessages[language].error.modificationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getMemberships(id: number): Promise<Membership[]> {
    const user = await this.userRepository.findOne({
      relations: {
        memberships: {
          membershipExtensions: true
        }
      },
      where: {
        id: id
      }
    });
    return user.memberships;
  }

  async joinActivity(language: Language, activityId: number, userId: number) {
    const user = await this.userRepository.findOne({
      relations: {
        activities: true,
        memberships: { membershipType: true }
      },
      where: { id: userId, memberships: { enable: true } }
    });

    if (!user)
      throw new HttpException(globalMessages[language].error.unauthorized, HttpStatus.UNAUTHORIZED);
    const activity = await this.activityService.getOneEnabledWithMembershipType(activityId);

    if (!activity) {
      throw new HttpException(
        globalMessages[language].error.activityNotFound,
        HttpStatus.NOT_FOUND
      );
    }
    const userWActivity = await this.userRepository.findOne({
      relations: ['activities'],
      where: {
        id: userId,
        activities: { id: activity.id }
      }
    });
    if (userWActivity) {
      throw new HttpException(
        globalMessages[language].error.userAlreadyInActivity,
        HttpStatus.BAD_REQUEST
      );
    }

    const userMemebershipTypeArray = this.makeMembershipTypeArray(user?.memberships);
    console.log(user);

    if (!userMemebershipTypeArray || userMemebershipTypeArray?.length <= 0)
      throw new HttpException(
        globalMessages[language].error.noUserMembership,
        HttpStatus.UNAUTHORIZED
      );

    const userHasCorrectMembership = this.verifyUserHasCorrectMembership(
      userMemebershipTypeArray,
      activity.membershipType
    );
    if (!userHasCorrectMembership)
      throw new HttpException(
        globalMessages[language].error.noUserMembership,
        HttpStatus.UNAUTHORIZED
      );
    user.activities = [...user.activities, activity];
    await this.activityService.updateMemberCount(activity);
    return user.save();
  }

  async getStatistics(id: number, language: Language) {
    const user = await this.userRepository.findOne({
      relations: {
        activities: true,
        weight: true
      },
      where: {
        id: id
      }
    });
    const activities = user.activities;
    const monthWeightObjs = await this.weightService.getLastMonthWeight(id, language);
    let monethWeightVals = new Array(30).fill(0);
    if (monthWeightObjs?.length > 0) monethWeightVals = this.getWeightValues(monthWeightObjs);
    const totalCaloriesBurnet = this.getColriesBurnet(activities) || 0;
    const totalWeightLost = monethWeightVals[monethWeightVals?.length - 1] - monethWeightVals[1];
    const BMI =
      user?.height && user?.weight
        ? monethWeightVals[29] / (((user.height / 100) * user.height) / 100)
        : 0;

    return { activities, monethWeightVals, totalWeightLost, totalCaloriesBurnet, BMI };
  }

  private getWeightValues(weights: Array<Weight>) {
    const monthlyWeight: Array<any> = new Array(weights.values.length);
    let lastLength = 0;
    for (const weight of weights) {
      monthlyWeight[30 - lastLength - 1] = weight.value;
      lastLength++;
    }

    const latestVal = monthlyWeight[30 - lastLength];
    console.log(30 - lastLength, latestVal);

    if (30 - lastLength > 0) {
      let i = 30 - lastLength;
      for (i; i >= 0; i--) {
        monthlyWeight[i] = latestVal;
      }
    }
    console.log(monthlyWeight.length);
    return monthlyWeight;
  }

  private verifyUserHasCorrectMembership(
    userMemberships: Array<MembershipType>,
    membershipType: MembershipType
  ) {
    let sameId = false;
    userMemberships.forEach((userMembershipType) => {
      console.log(userMembershipType.id, membershipType.id);

      if (userMembershipType.id === membershipType.id) sameId = true;
    });
    return sameId;
  }
  private makeMembershipTypeArray(membershipArray: Array<Membership>) {
    const membershipTypeArray = [];
    if (!membershipArray || membershipArray?.length <= 0) return null;
    membershipArray.forEach((membership) => membershipTypeArray.push(membership.membershipType));
    return membershipTypeArray;
  }
  private getColriesBurnet(activities: Array<Activity>) {
    let sumCalories = 0;
    for (const activity of activities) {
      sumCalories += activity.weightLoss;
    }
    return sumCalories;
  }
}
