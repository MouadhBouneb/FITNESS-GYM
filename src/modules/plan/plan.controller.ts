import { Controller, Get, Headers, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { globalMessages } from 'src/utils/global-messages';
import { PlanService } from './plan.service';
import { ApiTags } from '@nestjs/swagger';
import { Plan } from './plan.entity';
import { Language } from 'src/common/validators/language';

@ApiTags('plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async getAllPlans(@Headers() headers: any): Promise<Plan[]> {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.fr;
    }
    const plan = this.planService.getAll();
    if (!plan) {
      throw new HttpException(globalMessages[language].error.noPlanAvailable, HttpStatus.NOT_FOUND);
    }
    return plan;
  }
}
