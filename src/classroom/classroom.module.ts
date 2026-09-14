import { Module } from "@nestjs/common";
import { ClassroomController } from "./infra/classroom.controller";
import { DatabaseModule } from "../database/database.module";
import { UnitModule } from "../unit/unit.module";
import { CreateClassRoomUseCase } from "./domain/useCases/create-classroom.usecase";
import { CLASSROOM_REPOSITORY } from "./domain/ports/classroom.repository";
import { DrizzleClassroomRepository } from "./infra/drizzle-classroom.repository";
import { UNIT_REPOSITORY } from "../unit/domain/unity.repository";
import { DrizzleUnitRepository } from "../unit/infra/drizzle-unity.repository";
import { AddUserToClassRoom } from "./domain/useCases/add-user-to-classroom.usecase";
import { USER_CLASSROOM_REPOSITORY } from "./domain/ports/user-classroom.repository";
import { GOOGLE_CLASSROOM_CLIENT } from "./domain/ports/google-classroom-client";
import { GoogleClassroomAdapter } from "./infra/google-classroom-adapter";
import { GOOGLE_ACCOUNT_PROVIDER } from "../accounts/domain/google-account-provider";
import { GoogleAccountAdapter } from "../accounts/infra/google-account-provider.adapter";
import { DrizzleUserRepository } from "../users/infra/db/drizzle-user.repository";
import { USER_REPOSITORY } from "../users/domain/user.repository";
import { ACCOUNT_REPOSITORY } from "../accounts/domain/account.repository";
import { DrizzleAccountRepository } from "../accounts/infra/db/drizzle-accounts.repository";

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
        },
        {
            provide: GOOGLE_ACCOUNT_PROVIDER,
            useClass: GoogleAccountAdapter
        },
        {
            provide: USER_REPOSITORY,
            useClass: DrizzleUserRepository
        },
        {
            provide: ACCOUNT_REPOSITORY,
            useClass: DrizzleAccountRepository
        }
    ],
    controllers: [ClassroomController]
})
export class ClassRoomModule{}