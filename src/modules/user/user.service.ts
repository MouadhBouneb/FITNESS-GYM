import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserRequest } from '../../common/validators/user/request/create';
import { UpdateUserRequest } from '../../common/validators/user/request/update';
import { globalMessages } from 'src/utils/global-messages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async GetOne(id: number) {
    const user = await this.userRepository.findOne({
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
        login: createUserRequest.login
      });
      if (verifemail) {
        throw new HttpException(
          globalMessages[language].error.loginAlreadyUsed,
          HttpStatus.BAD_REQUEST
        );
      }

      const user = this.userRepository.create({
        ...createUserRequest
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        globalMessages[language].error.registrationFailed,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async update(language: string, id: number, updateUserRequest: UpdateUserRequest) {
    try {
      const user = await this.userRepository.findOneBy({ id: id });
      if (!user) {
        throw new HttpException(
          globalMessages[language].error.userNotFound,
          HttpStatus.BAD_REQUEST
        );
      }
      const verifemail = await this.userRepository
        .createQueryBuilder('user')
        .where('login = :login', { login: updateUserRequest.email })
        .andWhere('id != :id', { id: id })
        .getOne();
      if (verifemail) {
        throw new HttpException(
          globalMessages[language].error.loginAlreadyUsed,
          HttpStatus.BAD_REQUEST
        );
      }
      const userupdate = await this.userRepository.update({ id }, { ...updateUserRequest });
      return userupdate.affected == 0 ? false : true;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        globalMessages[language].error.modificationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
}
