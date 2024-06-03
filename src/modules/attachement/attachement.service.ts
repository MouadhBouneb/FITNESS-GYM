import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachement } from './attachement.entity';

@Injectable()
export class AttachementService {
  constructor(
    @InjectRepository(Attachement)
    private attachementRepository: Repository<Attachement>,
  ) {}
    async createPostImage(postId: number, image: Express.Multer.File): Promise<Attachement> {
        const createdAttachement = this.attachementRepository.create({
            post: { id: postId },
            path: image.path,
            extension: image.mimetype,
            name: image.originalname,
        })
        await this.attachementRepository.save(createdAttachement)
        return createdAttachement
    }
    async createUserImage(userId: number, image: Express.Multer.File): Promise<Attachement> {
        const createdAttachement = this.attachementRepository.create({
            user: { id: userId },
            path: image.path,
            extension: image.mimetype,
            name: image.originalname,
        })
        await this.attachementRepository.save(createdAttachement)
        return createdAttachement
    }
}