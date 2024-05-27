import { UserModule } from './user/user.module';
import { TaxeModule } from './taxe/taxe.module';
import { ReferenceStubModule } from './reference-stub/reference-stub.module';
import { PostModule } from './post/post.module';
import { MemebershipExtensionModule } from './memebership-extension/memebership-extension.module';
import { MembershipModule } from './membership/membership.module';
import { LikeModule } from './like/like.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ModuleModule } from './comment/module.module';
import { AttachementModule } from './attachement/attachement.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembershipPriceModule } from './memebership-price/membership-price.module';
import { MembershipTypeModule } from './membership-type/membership-type.module';
import { databaseConfig } from 'src/common/database/database';
import { ConfigService } from '@nestjs/config';
import { LanguageMiddleware } from 'src/common/middlewares/language.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthentificationModule } from './auth/authentification.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Add this line
    databaseConfig(new ConfigService()),
    MembershipTypeModule,
    UserModule,
    TaxeModule,
    ReferenceStubModule,
    PostModule,
    MemebershipExtensionModule,
    MembershipPriceModule,
    MembershipModule,
    LikeModule,
    InvoiceModule,
    ModuleModule,
    AuthentificationModule,
    AttachementModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
