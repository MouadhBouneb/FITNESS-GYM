/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { Language } from 'src/common/validators/language';
import { MembershipService } from './membership.service';
import { CreateMembershipRequest } from 'src/common/validators/membership/create';
import { AuthentificationService } from '../auth/authentification.service';
import { globalMessages } from 'src/utils/global-messages';
import { Request } from 'express';
import { MembershipPriceService } from '../memebership-price/membership-price.service';
import { MembershipExtensionService } from '../memebership-extension/membership-extension.service';
import { InvoiceService } from '../invoice/invoice.service';

@Controller('memberships')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly authService: AuthentificationService,
    private readonly membershipPriceService: MembershipPriceService,
    private readonly membershipExtensionService: MembershipExtensionService,
    private readonly invoiceService: InvoiceService
  ) {}

  @Post()
  @UsePipes()
  @UseGuards(JwtAuthenticationGuard)
  async create(
    @Headers() headers: any,
    @Req() request: Request,
    @Body() createMembershipRequest: CreateMembershipRequest
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.fr;
    }
    const token = request.cookies?.Authentication;
    const user = await this.authService.verifyToken(language, token);
    if (!user) {
      throw new HttpException(
        globalMessages[language].error.unableToVerifyToken,
        HttpStatus.UNAUTHORIZED
      );
    }
    const membershipPrice = await this.membershipPriceService.findById(
      createMembershipRequest.membershipPriceId
    );
    if (!membershipPrice) {
      throw new HttpException(
        globalMessages[language].error.noMembershipisAvailable,
        HttpStatus.NOT_FOUND
      );
    }
    const membership = await this.membershipService.create(
      createMembershipRequest,
      user,
      membershipPrice
    );
    const membershipExtension = await this.membershipExtensionService.create(
      membershipPrice.length,
      membership
    );
    await this.invoiceService.create(membershipExtension, membershipPrice, user);
    return membership;
  }
}
