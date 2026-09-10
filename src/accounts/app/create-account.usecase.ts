import { Inject, Injectable } from "@nestjs/common";
import { Email } from "../../shared/domains/value-objects/email.vo";
import { USER_REPOSITORY, type UserRepository } from "../../users/domain/user.repository";
import { UserNotFoundError } from "../../users/domain/user-not-found.error";
import { Account } from "../domain/account.entity";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../domain/account.repository";
import { AccountStatus } from "../domain/value-objects/account-status.vo";


@Injectable()
export class CreateUserAccountUseCase{
    constructor(
        @Inject(ACCOUNT_REPOSITORY) private readonly accountsRepository: AccountRepository,
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
    ){}

    async execute(userId: string){

        const user = await this.userRepository.findById(userId)

        if(!user){
            throw new UserNotFoundError()
        }

        const possibleEmailString = `${user.firstName.toLowerCase().trim().replace(" ", "")}.${user.lastName.toLowerCase().trim().replace(" ", "")}@aluno.edu.com.br`

        const emailEntity = Email.create(possibleEmailString)

        const googleExternalId = "123123" //call Google client

        const accountEntity = Account.create({
            userId: user.id, 
            googleEmailAddress: emailEntity,
            googleExternalId,
            status: AccountStatus.PENDING,
            createdAt: new Date()
        })

        await this.accountsRepository.save(accountEntity)

    }
}