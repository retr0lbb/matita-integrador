import { Inject, Injectable } from "@nestjs/common";
import { ACCOUNT_REPOSITORY,type AccountRepository } from "../domain/account.repository";

@Injectable()
export class ListAllAccountsUsecase{
    constructor(
        @Inject(ACCOUNT_REPOSITORY) private readonly accountRepo: AccountRepository
    ){}

    async execute(){
        const accounts = await this.accountRepo.listAccount()

        const response = accounts.map(account => ({
            id: account.id,
            email: account.email? account.email.getValue(): null,
            status: account.status,
            provider: account.provider,
            external_id: account.externalId,
            created_at: account.createdAt,
            updated_at: account.updatedAt
        }))

        return response
    }
}