import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UNIT_REPOSITORY, type UnitRepository } from "../unity.repository";
import { INSTITUTION_REPOSITORY, type InstitutionRepository } from "../../../institutions/domain/institution.repository";
import { Unit } from "../unit.entity";
import { randomUUID } from "crypto";


export type CreateUnitUseCasePayload = {
    institutionId: string,
    alias: string,
    address: string | null,
    externalId: string
}


@Injectable()
export class CreateUnityUseCase{

    constructor(
        @Inject(UNIT_REPOSITORY) private readonly unityRepository: UnitRepository,
        @Inject(INSTITUTION_REPOSITORY) private readonly instRepository: InstitutionRepository
    ){}

    async execute(payload: CreateUnitUseCasePayload){
        const institution = await this.instRepository.findById(payload.institutionId)

        if(!institution){
            throw new NotFoundException(`Institution under ${payload.institutionId} not found `)
        }

        const unitModel = Unit.create({
            address: payload.address, 
            alias: payload.alias, 
            externalId: payload.externalId,
            id: randomUUID(),
            institutionId: institution.id
        })

        await this.unityRepository.save(unitModel)
    }
}