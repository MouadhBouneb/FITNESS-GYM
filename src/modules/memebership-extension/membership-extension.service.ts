import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MembershipExtension } from "./membership-extension.entity";
import { Repository } from "typeorm"
import { Membership } from "../membership/membership.entity";
@Injectable()
export class MembershipExtensionService {
    constructor(
        @InjectRepository(MembershipExtension)
        private readonly membershipExtensionRepository: Repository<MembershipExtension>,
    ) { }
    async create(length: number, membership: Membership): Promise<MembershipExtension> {
        const membershipExt = this.membershipExtensionRepository.create({length:length,membership:membership})
        return this.membershipExtensionRepository.save(membershipExt)
    }
}