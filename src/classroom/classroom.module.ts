import { Module } from "@nestjs/common";
import { ClassroomController } from "./infra/classroom.controller";
import { DatabaseModule } from "../database/database.module";
import { UnitModule } from "../unit/unit.module";
import { CreateClassRoomUseCase } from "./domain/useCases/create-classroom.usecase";
import { CLASSROOM_REPOSITORY } from "./domain/classroom.repository";
import { DrizzleClassroomRepository } from "./infra/drizzle-classroom.repository";
import { UNIT_REPOSITORY } from "../unit/domain/unity.repository";
import { DrizzleUnitRepository } from "../unit/infra/drizzle-unity.repository";
import { AddUserToClassRoom } from "./domain/useCases/add-user-to-classroom.usecase";
import { USER_CLASSROOM_REPOSITORY } from "./domain/user-classroom.repository";
import { GOOGLE_CLASSROOM_CLIENT } from "./domain/google-classroom-client";
import { GoogleClassroomAdapter } from "./infra/google-classroom-adapter";

@Module({
    imports: [DatabaseModule, UnitModule],
    providers: [
        CreateClassRoomUseCase,
        AddUserToClassRoom,
        {
            provide: CLASSROOM_REPOSITORY,
            useClass: DrizzleClassroomRepository,
        },
        {
            provide: UNIT_REPOSITORY,
            useClass: DrizzleUnitRepository
        },
        {
            provide: USER_CLASSROOM_REPOSITORY,
            useClass: DrizzleClassroomRepository
        },
        {
            provide: GOOGLE_CLASSROOM_CLIENT,
            useClass: GoogleClassroomAdapter
        }
    ],
    controllers: [ClassroomController]
})
export class ClassRoomModule{}