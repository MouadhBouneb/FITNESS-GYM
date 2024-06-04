import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Plan } from "./plan.entity";
import { Repository, UpdateEvent } from 'typeorm'
import {EventSubscriber,EntitySubscriberInterface} from 'typeorm'
@EventSubscriber()
@Injectable()
export class PlanService implements EntitySubscriberInterface<Plan> {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>
    ) { }
    
    afterUpdate(event: UpdateEvent<Plan>): void | Promise<any> {
        console.log(event.entity,'AAAAAAA\nAAAAAAAAA');
    }
    async getOneByDate(date:string):Promise<Plan>
    {
        const plan = await  this.planRepository.findOneBy({date:date})
        console.log('found plan : ',plan);

        if (!plan){
            const createPlan = this.planRepository.create({date:date})
            console.log('created plan : ',createPlan);
            return await this.planRepository.save(createPlan)
        }
        return plan
    }
    async getAll(language:string){
        return await this.planRepository.find({relations:['data']})
    }
}