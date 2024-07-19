import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Attachement } from 'src/modules/attachement/attachement.entity';
import { Comment } from 'src/modules/comment/comment.entity';
import { Invoice } from 'src/modules/invoice/invoce.entity';
import { Like } from 'src/modules/like/like.entity';
import { Membership } from 'src/modules/membership/membership.entity';
import { MembershipType } from 'src/modules/membership-type/membership-type.entity';
import { MembershipExtension } from 'src/modules/memebership-extension/membership-extension.entity';
import { MembershipPrice } from 'src/modules/memebership-price/membership-price.entity';
import { Post } from 'src/modules/post/post.entity';
import { ReferenceStub } from 'src/modules/reference-stub/reference-stub.entity';
import { Taxe } from 'src/modules/taxe/taxe.entity';
import { User } from 'src/modules/user/user.entity';
import { Plan } from 'src/modules/plan/plan.entity';
import { Activity } from 'src/modules/activity/activity.entity';
import { SubActivity } from 'src/modules/sub-activity/sub-activity.entity';
import { Weight } from 'src/modules/weight/weight.entity';

export const databaseConfig = (configService: ConfigService) =>
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [
      Attachement,
      Comment,
      Like,
      Membership,
      MembershipType,
      MembershipExtension,
      MembershipPrice,
      Post,
      ReferenceStub,
      Taxe,
      User,
      Invoice,
      Plan,
      Activity,
      SubActivity,
      Weight,
    ],
    synchronize: true
  });
