import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachement } from './attachement.entity';
import * as fs from 'fs';
@Injectable()
export class AttachementService {
  constructor(
    @InjectRepository(Attachement)
    private attachementRepository: Repository<Attachement>
  ) {}
  async createPostImage(postId: number, image: Express.Multer.File): Promise<Attachement> {
    const createdAttachement = this.attachementRepository.create({
      post: { id: postId },
      path: image.path,
      mimetype: image.mimetype,
      name: image.originalname
    });
    return await this.attachementRepository.save(createdAttachement);
  }
  async createUserImage(userId: number, image: Express.Multer.File): Promise<Attachement> {
    const createdAttachement = this.attachementRepository.create({
      user: { id: userId },
      path: image.path,
      mimetype: image.mimetype,
      name: image.originalname
    });
    return await this.attachementRepository.save(createdAttachement);
  }
  async deleteImage(file: Express.Multer.File | Attachement) {
    if (file?.path) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      console.log('file deleted');
      return await this.attachementRepository.delete({
        path: file.path
      });
    }
  }
  async getBase64File(file: Express.Multer.File | Attachement) {
    const base64 = fs.readFileSync(file.path, 'base64');
    return `data:${file.mimetype};base64,${base64}`;
  }
  async createMembershipTypeImage(
    memebershipTypeId: number,
    image: Express.Multer.File
  ): Promise<Attachement> {
    const createdAttachement = this.attachementRepository.create({
      memebershipType: { id: memebershipTypeId },
      path: image.path,
      mimetype: image.mimetype,
      name: image.originalname
    });
    return await this.attachementRepository.save(createdAttachement);
  }
}
