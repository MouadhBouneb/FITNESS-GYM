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

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

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
  @Roles('ADMIN', 'ROOT')
  @Post('/delete')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  async deleteActivity(@Body() deleteActivityRequest: DeleteActivityRequest) {
    console.log(deleteActivityRequest.id);
    return await this.activityService.deleteActivity(deleteActivityRequest.id);
  }
}
