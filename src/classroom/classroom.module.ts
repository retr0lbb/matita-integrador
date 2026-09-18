import { Module } from "@nestjs/common";
import { ClassroomController } from "./infra/classroom.controller";
import { DatabaseModule } from "../database/database.module";
import { UnitModule } from "../unit/unit.module";
import { CreateClassRoomUseCase } from "./application/useCases/create-classroom.usecase";
import { CLASSROOM_REPOSITORY } from "./domain/ports/classroom.repository";
import { DrizzleClassroomRepository } from "./infra/drizzle-classroom.repository";
import { UNIT_REPOSITORY } from "../unit/domain/unity.repository";
import { DrizzleUnitRepository } from "../unit/infra/drizzle-unity.repository";
import { AddUserToClassRoom } from "./application/useCases/add-user-to-classroom.usecase";
import { USER_CLASSROOM_REPOSITORY } from "./domain/ports/user-classroom.repository";
import { GOOGLE_CLASSROOM_CLIENT } from "./domain/ports/google-classroom-client";
import { GoogleClassroomAdapter } from "./infra/google-classroom-adapter";
import { GOOGLE_ACCOUNT_PROVIDER } from "../accounts/domain/google-account-provider";
import { GoogleAccountAdapter } from "../accounts/infra/google-account-provider.adapter";
import { DrizzleUserRepository } from "../users/infra/db/drizzle-user.repository";
import { USER_REPOSITORY } from "../users/domain/user.repository";
import { ACCOUNT_REPOSITORY } from "../accounts/domain/account.repository";
import { DrizzleAccountRepository } from "../accounts/infra/db/drizzle-accounts.repository";
import { CLASSROOM_OWNER_QUERY } from "./domain/ports/classroom-owner.query";
import { DeleteClassRoomUsecase } from "./application/useCases/delete-classroom.usecase";
import { ListUnitClassesUseCase } from "./application/useCases/list-classes.usecase";

@Module({
    imports: [DatabaseModule, UnitModule],
    providers: [
        CreateClassRoomUseCase,
        AddUserToClassRoom,
        DeleteClassRoomUsecase,
        ListUnitClassesUseCase,
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
        },
        {
            provide: CLASSROOM_OWNER_QUERY,
            useClass: DrizzleClassroomRepository
        }
    ],
    controllers: [ClassroomController]
})
export class ClassRoomModule{}