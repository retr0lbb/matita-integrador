import { Inject, Injectable } from "@nestjs/common";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../domain/account.repository";
import { USER_REPOSITORY, type UserRepository } from "../../users/domain/user.repository";
import { AccountNotFoundError } from "../domain/errors/account-not-found";
import { UserNotFoundError } from "../../users/app/error/user-not-found";

@Injectable()
export class GetAccountUseCase{
    constructor(
        @Inject(ACCOUNT_REPOSITORY) private readonly accountRepo: AccountRepository,
        @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository
    ){}

    async execute(accountId: string){
        const account = await this.accountRepo.findById(accountId)
        if(!account){
            throw new AccountNotFoundError()
        }
        const userToAccont = await this.userRepo.findById(account.userId)

        if(!userToAccont){
            throw new UserNotFoundError()
        }

        return {
            id: account.id,
            email: account.email?.getValue(),
            provider: account.provider,
            external_id: account.externalId,
            user: {
                id: userToAccont.id,
                first_name: userToAccont.firstName,
                last_name: userToAccont.lastName,
                role: userToAccont.role
            }
        }
    }
}