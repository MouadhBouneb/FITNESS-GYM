/*
https://docs.nestjs.com/providers#services
*/
import { Repository } from 'typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Taxe } from './taxe.entity';
import { CreateTaxeRequest } from '../../common/validators/taxe/request/create';
import { UpdateTaxeRequest } from '../../common/validators/taxe/request/update';

@Injectable()
export class TaxeService  {
  constructor(
    @InjectRepository(Taxe)
    private taxeRepository: Repository<Taxe>
  ) {}
 
  async create(createTaxeRequest: CreateTaxeRequest): Promise<Taxe> {
    const createdTaxe: Taxe = this.taxeRepository.create(createTaxeRequest);
    return this.taxeRepository.save(createdTaxe);
  }

  async update(id: number, UpdateTaxeRequest: UpdateTaxeRequest) {
    return this.taxeRepository.update(id, UpdateTaxeRequest);
  }

  async findAll(): Promise<Taxe[]> {
    return this.taxeRepository.find({
      where: {
        enable: true
      }
    });
  }
  async findById(id: number): Promise<Taxe> {
    return this.taxeRepository.findOne({
      where: {
        id: id
      }
    });
  }
  async findByCode(code: string): Promise<Taxe> {
    return this.taxeRepository.findOne({
      where: {
        code: code
      }
    });
  }

  async deleteById(id: number) {
    return this.taxeRepository.delete(id);
  }
}
