import { Inject, Injectable } from "@nestjs/common";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../domain/account.repository";
import { GOOGLE_ACCOUNT_PROVIDER, type GoogleAccountProviderClient } from "../domain/google-account-provider";
import { EmailNotFond } from "../domain/errors/email-not-found";


@Injectable()
export class DeleteAccountUseCase{
    constructor(
        @Inject(ACCOUNT_REPOSITORY) private readonly accountsRepository: AccountRepository,
        @Inject(GOOGLE_ACCOUNT_PROVIDER) private readonly googleAccount: GoogleAccountProviderClient
    ){}

    async execute(accountId: string){
        const account = await this.accountsRepository.findById(accountId)

        if(!account){
            return //previously i threw an error here
        }

        if(account.externalId){
            const googleAccount = await this.googleAccount.findAccount(account.externalId)
            if(!googleAccount){
                return
            }

            if(!account.email){
                throw new EmailNotFond()
            }

            await this.googleAccount.deleteAccount(account.email.getValue(), "/Integrador-teste/Maplebear - Krypton")
        }

        await this.accountsRepository.delete(account.id)
    }
}