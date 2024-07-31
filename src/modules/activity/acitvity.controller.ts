import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { RoleGuard } from '../auth/role.guard';
import { CreateActivityRequest } from 'src/common/validators/activity/request/create';
import { ActivityService } from './activity.service';
import { globalMessages } from 'src/utils/global-messages';
import { Language } from 'src/common/validators/language';
import { UpdateActivityRequest } from 'src/common/validators/activity/request/update';
import { DeleteActivityRequest } from 'src/common/validators/activity/request/delete';
import { AuthentificationService } from '../auth/authentification.service';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { PlanService } from '../plan/plan.service';

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly authService: AuthentificationService,
    private readonly userService: UserService,
    private readonly planService: PlanService
  ) {}

  @Roles('ADMIN', 'ROOT')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @Post()
  async createActivity(@Body() activityReq: CreateActivityRequest, @Headers() headers: any) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    return this.activityService.create(activityReq, language);
  }
  @Roles('ADMIN', 'ROOT')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @Put()
  async updateActivity(@Body() activityUpdateReq: UpdateActivityRequest) {
    return this.activityService.update(activityUpdateReq);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('sub-activities/:id')
  async getSubActivities(@Param('id', new ParseIntPipe()) id: number, @Headers() headers: any) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }

    const subActivities = await this.activityService.getSubActivities(id);
    if (!subActivities || subActivities?.length == 0) {
      throw new HttpException(globalMessages[language].error.noSubActivities, HttpStatus.NOT_FOUND);
    }
    return subActivities;
  }

  @Post('join/:id')
  @UseGuards(JwtAuthenticationGuard)
  async joinActivity(
    @Req() request: Request,
    @Headers() headers: any,
    @Param('id', new ParseIntPipe()) activityId: number
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const decodedUser = await this.authService.verifyToken(language, token);
    if (!decodedUser) {
      throw new HttpException(
        globalMessages[request['lang']].error.unauthorized,
        HttpStatus.UNAUTHORIZED
      );
    }
    const user = await this.userService.GetOneWithActivitiesAndMembership(decodedUser.id);
    if (!user) {
      throw new HttpException(
        globalMessages[request['lang']].error.unauthorized,
        HttpStatus.UNAUTHORIZED
      );
    }
    const activity = await this.activityService.getOneEnabledWithMembershipType(activityId);
    if (!activity) {
      throw new HttpException(
        globalMessages[language].error.activityNotFound,
        HttpStatus.NOT_FOUND
      );
    }
    const userHasActivity = await this.userService.GetUserWithSpecifiedActivity(
      user.id,
      activityId
    );
    console.log(userHasActivity);

    if (userHasActivity) {
      throw new HttpException(
        globalMessages[language].error.userAlreadyInActivity,
        HttpStatus.BAD_REQUEST
      );
    }

    return this.activityService.joinActivity(language, activity, user);
  }

  @Roles('ADMIN', 'ROOT')
  @Post('/delete')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  async deleteActivity(@Body() deleteActivityRequest: DeleteActivityRequest) {
    console.log(deleteActivityRequest.id);
    return await this.activityService.deleteActivity(deleteActivityRequest.id);
  }

  @Get('all')
  @UseGuards(JwtAuthenticationGuard)
  async getAllActivities(@Req() request: Request, @Headers() headers: any) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const decodedUser = await this.authService.verifyToken(language, token);
    if (!decodedUser) {
      throw new HttpException(
        globalMessages[request['lang']].error.unauthorized,
        HttpStatus.UNAUTHORIZED
      );
    }
    const user = await this.userService.GetOneWithActivitiesAndMembership(decodedUser.id);
    if (!user) {
      throw new HttpException(
        globalMessages[request['lang']].error.unauthorized,
        HttpStatus.UNAUTHORIZED
      );
    }
    return await this.activityService.getAll(user, language);
  }
}
