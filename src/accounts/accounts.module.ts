import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateUserAccountUseCase } from "./app/create-account.usecase";
import { ACCOUNT_REPOSITORY } from "./domain/account.repository";
import { DrizzleAccountRepository } from "./infra/db/drizzle-accounts.repository";
import { AccountsController } from "./presentation/accounts.controller";
import { USER_REPOSITORY } from "../users/domain/user.repository";
import { DrizzleUserRepository } from "../users/infra/db/drizzle-user.repository";


@Module({
    imports: [DatabaseModule],
    controllers: [AccountsController],
    providers: [CreateUserAccountUseCase,
        {
            provide: ACCOUNT_REPOSITORY,
            useClass: DrizzleAccountRepository
        },
        {
            provide: USER_REPOSITORY,
            useClass: DrizzleUserRepository
        }
    ]
})
export class AccountModule{}