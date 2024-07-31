import { UserModule } from './user/user.module';
import { TaxeModule } from './taxe/taxe.module';
import { ReferenceStubModule } from './reference-stub/reference-stub.module';
import { PostModule } from './post/post.module';
import { MemebershipExtensionModule } from './memebership-extension/memebership-extension.module';
import { MembershipModule } from './membership/membership.module';
import { LikeModule } from './like/like.module';
import { InvoiceModule } from './invoice/invoice.module';
import { AttachementModule } from './attachement/attachement.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembershipPriceModule } from './memebership-price/membership-price.module';
import { MembershipTypeModule } from './membership-type/membership-type.module';
import { databaseConfig } from 'src/common/database/database';
import { ConfigService } from '@nestjs/config';
import { LanguageMiddleware } from 'src/common/middlewares/language.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthentificationModule } from './auth/authentification.module';
import { PlanModule } from './plan/plan.module';
import { ActivityModule } from './activity/activity.module';
import { SubActivityModule } from './sub-activity/sub-activity.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WeightModule } from './weight/weight.module';
import { CommentModule } from './comment/comment.module';
import { ImageResizeMiddleware } from 'src/common/middlewares/photoResize.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthentificationModule,
    databaseConfig(new ConfigService()),
    MembershipTypeModule,
    UserModule,
    PlanModule,
    ActivityModule,
    SubActivityModule,
    TaxeModule,
    ReferenceStubModule,
    PostModule,
    MemebershipExtensionModule,
    MembershipPriceModule,
    MembershipModule,
    LikeModule,
    InvoiceModule,
    CommentModule,
    AttachementModule,
    ActivityModule,
    SubActivityModule,
    WeightModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ImageResizeMiddleware)
      .forRoutes(
        { path: 'users/photo', method: RequestMethod.POST },
        { path: 'membership-types', method: RequestMethod.POST },
        { path: 'posts', method: RequestMethod.POST }
      );
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
