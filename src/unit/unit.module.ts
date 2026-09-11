import { Module } from "@nestjs/common";
import { UnitController } from "./infra/unit.controller";
import { DatabaseModule } from "../database/database.module";
import { InstitutionModule } from "../institutions/instutution.module";
import { CreateUnityUseCase } from "./domain/usecase/create-unit.usecase";
import { UNIT_REPOSITORY } from "./domain/unity.repository";
import { DrizzleUnitRepository } from "./infra/drizzle-unity.repository";
import { INSTITUTION_REPOSITORY } from "../institutions/domain/institution.repository";
import { DrizzleInstitutionRepository } from "../institutions/infra/drizzzle-institution.repository";

@Module({
    imports: [DatabaseModule, InstitutionModule],
    providers: [CreateUnityUseCase, {
        provide: UNIT_REPOSITORY,
        useClass: DrizzleUnitRepository
    },
{
    provide: INSTITUTION_REPOSITORY,
    useClass: DrizzleInstitutionRepository
}],
    controllers: [UnitController]
})
export class UnitModule{}