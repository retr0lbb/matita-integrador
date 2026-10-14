import { Inject, Injectable } from "@nestjs/common";
import { UNIT_REPOSITORY, type UnitRepository } from "../unity.repository";
import { UseCase } from "../../../shared/domains/use-case.interface";
import { GOOGLE_UNIT_PORT, type GoogleUnitPort } from "../google.unit.part";
import { UnitNotFound } from "../errors/unit-not-found";

@Injectable()
export class LinkUnitToGoogle implements UseCase{
    constructor(
        @Inject(UNIT_REPOSITORY) private readonly unitRepo: UnitRepository,
        @Inject(GOOGLE_UNIT_PORT) private readonly googleUnit: GoogleUnitPort
    ){}

    async execute(unitId: string, mode: "MANUAL" | "SYNC" |"AUTO_MATCH"){
        const unit = await this.unitRepo.findById(unitId)

        if(!unit){
            throw new UnitNotFound()
        }

        const path = await this.googleUnit.create(unit, mode)

        return path
    }
}