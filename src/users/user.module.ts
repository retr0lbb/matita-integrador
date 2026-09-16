import { Module } from "@nestjs/common";
import { UserController } from "./presentation/user.controller";
import { CreateUserUseCase } from "./app/usecases/create-user.usecase";
import { USER_REPOSITORY } from "./domain/user.repository";
import { DrizzleUserRepository } from "./infra/db/drizzle-user.repository";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [CreateUserUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: DrizzleUserRepository
        }
    ]
})
export class UserModule{}