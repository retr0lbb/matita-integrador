import { Module } from "@nestjs/common";
import { ClassroomController } from "./infra/classroom.controller";
import { DatabaseModule } from "../database/database.module";
import { UnitModule } from "../unit/unit.module";
import { CreateClassRoomUseCase } from "./domain/useCases/create-classroom.usecase";
import { CLASSROOM_REPOSITORY } from "./domain/classroom.repository";
import { DrizzleClassroomRepository } from "./infra/drizzle-classroom.repository";
import { UNIT_REPOSITORY } from "../unit/domain/unity.repository";
import { DrizzleUnitRepository } from "../unit/infra/drizzle-unity.repository";



@Module({
    imports: [DatabaseModule, UnitModule],
    providers: [
        CreateClassRoomUseCase,
        {
            provide: CLASSROOM_REPOSITORY,
            useClass: DrizzleClassroomRepository,
        },
        {
            provide: UNIT_REPOSITORY,
            useClass: DrizzleUnitRepository
        }
    ],
    controllers: [ClassroomController]
})
export class ClassRoomModule{}