import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserRequest } from '../../common/validators/user/request/create';
import { UpdateUserRequest } from '../../common/validators/user/request/update';
import { globalMessages } from 'src/utils/global-messages';
import { JwtService } from '@nestjs/jwt';
import { AttachementService } from '../attachement/attachement.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService : JwtService,
    private attachmentService: AttachementService
  ) {}

  async GetOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      }
    });
    return user;
  }
  async DecodeAndGet(language:string,token:string):Promise<User>{

    const decodedUser = await this.jwtService.decode(token)
    if (!decodedUser)
      {
        throw new HttpException(
          globalMessages[language].error.unauthorized,
          HttpStatus.UNAUTHORIZED
        )
      }
    
    return this.GetOne(decodedUser.id)
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

      console.log(createUserRequest);

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
  async setPhoto(language:string,user:User,photo:Express.Multer.File)
  {
    const updatedUser = this.userRepository.update(user.id,
      await this.attachmentService.createUserImage(user.id,photo))  
    console.log(updatedUser)
    return 'aa'

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
