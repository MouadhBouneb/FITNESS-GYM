import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './invoce.entity';
import { Repository } from 'typeorm';
import { MembershipExtension } from '../memebership-extension/membership-extension.entity';
import { MembershipPrice } from '../memebership-price/membership-price.entity';
import { TaxeService } from '../taxe/taxe.service';
import { User } from '../user/user.entity';
import { CreateTaxeRequest } from 'src/common/validators/taxe/request/create';
import { randomUUID } from 'crypto';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly taxService: TaxeService
    ) { }
    async create(membershipExt: MembershipExtension, membershipPrice: MembershipPrice, user: User): Promise<Invoice> {
        const taxe = await this.getTaxe()
        const totalHT = membershipPrice.price
        const discountAmount = membershipPrice.discount ? membershipPrice.discount / 100 : 0
        const totalTTC = discountAmount ?
            totalHT + (totalHT * taxe.value / 100) * discountAmount :
            totalHT + (totalHT * taxe.value / 100)
        const discountedPrice = membershipPrice.price - totalTTC
        const code = randomUUID()
        const invoice = this.invoiceRepository.create({
            membershipExtension: membershipExt,
            totalHT: totalHT,
            totalTTC: totalTTC,
            taxeTVA: taxe,
            discountAmount: discountedPrice,
            user: user,
            code:code
        })
        return this.invoiceRepository.save(invoice)
    }

    async getTaxe() {
        const taxe = await this.taxService.findByCode("TAX001")        
        if (taxe?.value) return taxe
        const createTaxe:CreateTaxeRequest = {
            code: "TAX001",
            value:9,
            enable:true
        }        
        return await this.taxService.create(createTaxe)
    }
}