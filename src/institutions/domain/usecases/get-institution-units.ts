import { INSTITUTION_REPOSITORY, type InstitutionRepository } from "../../../institutions/domain/institution.repository";
import { UseCase } from "../../../shared/domains/use-case.interface";
import { InstitutionNotFound } from "../../../institutions/domain/errors/institution-not-found";
import { UNIT_REPOSITORY, type UnitRepository } from "../../../unit/domain/unity.repository";
import { Unit } from "../../../unit/domain/unit.entity";
import { Inject } from "@nestjs/common";


export class ListInstitutionsUnitsUseCase implements UseCase{
    constructor(
        @Inject(INSTITUTION_REPOSITORY) private readonly instRepo: InstitutionRepository,
        @Inject(UNIT_REPOSITORY) private readonly unitRepo: UnitRepository
    ){}

    async execute(institutionId: string): Promise<Unit[]> {
        const institution = await this.instRepo.findById(institutionId)

        if(!institution){
            throw new InstitutionNotFound()
        }

        const units = await this.unitRepo.findManyByInstitution(institution)

        return units
    }
}