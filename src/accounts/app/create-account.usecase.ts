import { Inject, Injectable } from "@nestjs/common";
import { Email } from "../../shared/domains/value-objects/email.vo";
import { USER_REPOSITORY, type UserRepository } from "../../users/domain/user.repository";
import { UserNotFoundError } from "../../users/domain/user-not-found.error";
import { Account } from "../domain/account.entity";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../domain/account.repository";
import { AccountStatus } from "../domain/value-objects/account-status.vo";
import { GOOGLE_ACCOUNT_PROVIDER, type GoogleAccountProviderClient } from "../domain/google-account-provider";
import { accountStatus } from "../../database/schemas/accountSchema";


@Injectable()
export class CreateUserAccountUseCase{
    constructor(
        @Inject(ACCOUNT_REPOSITORY) private readonly accountsRepository: AccountRepository,
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
        @Inject(GOOGLE_ACCOUNT_PROVIDER) private readonly googleAccount: GoogleAccountProviderClient
    ){}

    async execute(userId: string){

        const user = await this.userRepository.findById(userId)

        if(!user){
            throw new UserNotFoundError()
        } 

        const possibleEmailString = `${user.firstName.toLowerCase().trim().replace(" ", "")}.${user.lastName.toLowerCase().trim().replace(" ", "")}@aluno.gedu.demo.matita.com.br`

        const emailEntity = Email.create(possibleEmailString)

        const userWithEmailAlreadyExists = await this.googleAccount.findAccount(emailEntity.getValue())

        if(userWithEmailAlreadyExists !== null){
            throw new Error("User with this email already exists")
        }

        const accountEntity = Account.create({
            userId: user.id, 
            googleEmailAddress: emailEntity,
            googleExternalId: null,
            status: AccountStatus.PENDING,
            createdAt: new Date()
        })

        await this.accountsRepository.save(accountEntity)

        try {
            const googleExternalId = await this.googleAccount.createAccount({
                email: emailEntity.getValue(),
                familyName: user.lastName,
                givenName: user.firstName,
                orgUnitPath: `/Integrador-teste/Maplebear - Krypton/ALUNOS`
            })

            accountEntity.activate(googleExternalId)

        } catch (error) {
            accountEntity.markAsFailed()
            console.log(error)
        }
        finally{
            await this.accountsRepository.updateGoogleIdForAccount(accountEntity)
        }
    }
}