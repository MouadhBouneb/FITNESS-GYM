import {
  Body,
  Controller,
  Delete,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { RoleGuard } from '../auth/role.guard';
import { SubActivityService } from './sub-activity.service';
import { SubActivity } from './sub-activity.entity';
import { CreateSubActivityRequest } from 'src/common/validators/sub-activity/request/create';
import { Language } from 'src/common/validators/language';

@ApiTags('sub-activities')
@Controller('sub-activities')
export class SubActivityController {
  constructor(private readonly subActivityService: SubActivityService) {}
  @Roles('ADMIN', 'ROOT')
  @Post()
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  @ApiBody({ type: CreateSubActivityRequest })
  async create(
    @Body() subActivity: CreateSubActivityRequest,
    @Headers() headers: any
  ): Promise<SubActivity> {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    return this.subActivityService.create(subActivity, language);
  }
  @Roles('ADMIN', 'ROOT')
  @Delete('delete/:id')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  async deleteSubActivity(@Headers() headers: any, @Param('id', new ParseIntPipe()) id: number) {
    return await this.subActivityService.deleteSubActivity(id);
  }

  //   @UseGuards(JwtAuthenticationGuard)
  //   @Get('sub-activities')
  //   async getSubActivities(
  //     @Body() body: GetSubActivitiesRequest,
  //     @Headers() headers: any
  //   ): Promise<SubActivity[]> {
  //     let language: Language = Language[headers?.['accept-language']];
  //     if (!language) {
  //       language = Language.en;
  //     }
  //     return await this.subActivityService.getSubActivities(body.activityId, language);
  //   }
}
