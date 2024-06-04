import { Controller, Get, Headers, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import JwtAuthenticationGuard from "../auth/jwt-authentication.guard";
import { globalMessages } from "src/utils/global-messages";
import { PlanService } from "./plan.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('plans')
@Controller('plans')
export class PlanController {
    constructor(
        private readonly planService: PlanService
    ) { }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    async getAllPlans(@Headers() headers: Object) {
        if (!headers['accept-language']) {
            throw new HttpException(
                globalMessages['fr'].error.missingLanguage,
                HttpStatus.UNAUTHORIZED
            );
        }
        const Language = headers['accept-language']
        const plan = this.planService.getAll(Language)
        if (!plan) {
            throw new HttpException(
                globalMessages[Language].error.noPlansAvailable,
                HttpStatus.NOT_FOUND
            )
        }
        return plan
    }
}