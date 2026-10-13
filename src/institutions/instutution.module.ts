import { Module } from "@nestjs/common";
import { InstitutionController } from "./infra/institution.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateInstitutionUseCase } from "./domain/usecases/create-institution";
import { INSTITUTION_REPOSITORY } from "./domain/institution.repository";
import { DrizzleInstitutionRepository } from "./infra/drizzzle-institution.repository";
import { listInstitutionsUseCase } from "./domain/usecases/list-institutions";

@Module({
    imports: [DatabaseModule],
    controllers: [InstitutionController],
    providers: [
        CreateInstitutionUseCase,
        listInstitutionsUseCase,
        {
            provide: INSTITUTION_REPOSITORY,
            useClass: DrizzleInstitutionRepository
        }
    ]
})
export class InstitutionModule {}