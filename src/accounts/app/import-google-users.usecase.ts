import { Inject } from "@nestjs/common";
import { GOOGLE_ACCOUNT_PROVIDER,type GoogleAccountProviderClient } from "../domain/google-account-provider";
import { USER_REPOSITORY, type UserRepository } from "../../users/domain/user.repository";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../domain/account.repository";
import { Account, ExternalProvider } from "../domain/account.entity";
import { inferRoleFromOrgUnit } from "../../users/domain/infer-role";
import { User } from "../../users/domain/user.entity";
import { Email } from "../../shared/domains/value-objects/email.vo";


export class ImportGoogleAccountsUseCase{
    constructor(
        @Inject(GOOGLE_ACCOUNT_PROVIDER) private readonly accountProvider: GoogleAccountProviderClient,
        @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
        @Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: AccountRepository
    ){}

    async execute(orgUnit: string): Promise<{ createdUsers: string[]; alreadyLinked: string[] }>{
        const googleAccounts = await this.accountProvider.listAllAccounts(orgUnit)
        const createdUsers: string[] = []
        const alreadyLinked: string[] = [];

        for(const googleAccount of googleAccounts){
            const existing = await this.accountRepository.findByProviderAndExternalId(ExternalProvider.GOOGLE, googleAccount.id)

            if(existing){
                alreadyLinked.push(googleAccount.email)
                continue;
            }

            const role = inferRoleFromOrgUnit(googleAccount.orgPath!)

            const user = User.create({
                firstName: googleAccount.familyName,
                lastName: googleAccount.givenName,
                role
            })

            await this.userRepo.save(user)

            const account = Account.create({userId: user.id, provider: ExternalProvider.GOOGLE, email: Email.create(googleAccount.email), hash: null})

            account.link(googleAccount.id)
            account.activate()

            await this.accountRepository.save(account)

            createdUsers.push(googleAccount.email)
        }

        return {createdUsers, alreadyLinked}
    }
}