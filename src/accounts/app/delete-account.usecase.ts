import { Inject, Injectable } from "@nestjs/common";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../domain/account.repository";
import { GOOGLE_ACCOUNT_PROVIDER, type GoogleAccountProviderClient } from "../domain/google-account-provider";


@Injectable()
export class DeleteAccountUseCase{
    constructor(
        @Inject(ACCOUNT_REPOSITORY) private readonly accountsRepository: AccountRepository,
        @Inject(GOOGLE_ACCOUNT_PROVIDER) private readonly googleAccount: GoogleAccountProviderClient
    ){}

    async execute(accountId: string){
        const account = await this.accountsRepository.findById(accountId)

        if(!account){
            throw new Error("Account already not exists")
        }

        if(account.googleExternalId){
            const googleAccount = await this.googleAccount.findAccount(account.googleExternalId)
            if(!googleAccount){
                return
            }

            await this.googleAccount.deleteAccount(account.googleEmailAddress.getValue(), "/Integrador-teste/Maplebear - Krypton")
        }

        await this.accountsRepository.delete(account.id)
    }
}