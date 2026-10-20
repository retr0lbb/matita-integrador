import { Module } from "@nestjs/common";
import { InstitutionController } from "./infra/institution.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateInstitutionUseCase } from "./domain/usecases/create-institution";
import { INSTITUTION_REPOSITORY } from "./domain/institution.repository";
import { DrizzleInstitutionRepository } from "./infra/drizzzle-institution.repository";
import { listInstitutionsUseCase } from "./domain/usecases/list-institutions";
import { UNIT_REPOSITORY } from "../unit/domain/unity.repository";
import { DrizzleUnitRepository } from "../unit/infra/drizzle-unity.repository";
import { ListInstitutionsUnitsUseCase } from "./domain/usecases/get-institution-units";

@Module({
    imports: [DatabaseModule],
    controllers: [InstitutionController],
    providers: [
        CreateInstitutionUseCase,
        listInstitutionsUseCase,
        ListInstitutionsUnitsUseCase,
        {
            provide: INSTITUTION_REPOSITORY,
            useClass: DrizzleInstitutionRepository
        },
        {
            provide: UNIT_REPOSITORY,
            useClass: DrizzleUnitRepository
        }
    ]
})
export class InstitutionModule {}