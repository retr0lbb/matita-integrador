import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateUserAccountUseCase } from "./app/create-account.usecase";
import { ACCOUNT_REPOSITORY } from "./domain/account.repository";
import { DrizzleAccountRepository } from "./infra/db/drizzle-accounts.repository";
import { AccountsController } from "./presentation/accounts.controller";
import { USER_REPOSITORY } from "../users/domain/user.repository";
import { DrizzleUserRepository } from "../users/infra/db/drizzle-user.repository";
import { GOOGLE_ACCOUNT_PROVIDER } from "./domain/google-account-provider";
import { GoogleAccountAdapter } from "./infra/google-account-provider.adapter";
import { DeleteAccountUseCase } from "./app/delete-account.usecase";
import { ImportGoogleAccountsUseCase } from "./app/import-google-users.usecase";

@Module({
    imports: [DatabaseModule],
    controllers: [AccountsController],
    providers: [
        CreateUserAccountUseCase,
        DeleteAccountUseCase,
        ImportGoogleAccountsUseCase,
        {
            provide: ACCOUNT_REPOSITORY,
            useClass: DrizzleAccountRepository
        },
        {
            provide: USER_REPOSITORY,
            useClass: DrizzleUserRepository
        },
        {
            provide: GOOGLE_ACCOUNT_PROVIDER,
            useClass: GoogleAccountAdapter
        }
    ]
})
export class AccountModule{}