import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateUserAccountUseCase } from "../app/create-account.usecase";
import { DeleteAccountUseCase } from "../app/delete-account.usecase";
import { ImportGoogleAccountsUseCase } from "../app/import-google-users.usecase";
import { GetAccountUseCase } from "../app/get-account.usecase";
import { ListAllAccountsUsecase } from "../app/list-accounts.usecase";

@Controller("/accounts")
export class AccountsController{
    constructor(
        private readonly createUserAccountUseCase: CreateUserAccountUseCase,
        private readonly deleteUserAccountUseCase: DeleteAccountUseCase,
        private readonly importFromGoogle: ImportGoogleAccountsUseCase,
        private readonly getAccount: GetAccountUseCase,
        private readonly listAccounts: ListAllAccountsUsecase
    ){}

    @Post()
    async createUserAccount(@Body() payload: {userId: string} ){
        await this.createUserAccountUseCase.execute(payload.userId)
        return "ok"
    }

    @Get()
    async listAllAccountsRoute(){
        return await this.listAccounts.execute()
    }

    @Get("/:id")
    async getAccountRoute(@Param("id") accountId: string){
        if(!accountId){
            throw new BadRequestException("Id not provided")
        }

        return await this.getAccount.execute(accountId)
    }

    @Delete("/:id")
    async deleteUserAccount(@Param("id") accountId: string){
        await this.deleteUserAccountUseCase.execute(accountId)
    }

    @Post("/import/google")
    async sincWithGoogle(@Body() body: {orgPath: string}){
        return await this.importFromGoogle.execute(body.orgPath)
    }
}