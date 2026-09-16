import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { CreateUserAccountUseCase } from "../app/create-account.usecase";
import { DeleteAccountUseCase } from "../app/delete-account.usecase";
import { ImportGoogleAccountsUseCase } from "../app/import-google-users.usecase";

@Controller("/accounts")
export class AccountsController{
    constructor(
        private readonly createUserAccountUseCase: CreateUserAccountUseCase,
        private readonly deleteUserAccountUseCase: DeleteAccountUseCase,
        private readonly importFromGoogle: ImportGoogleAccountsUseCase
    ){}

    @Post()
    async createUserAccount(@Body() payload: {userId: string} ){
        await this.createUserAccountUseCase.execute(payload.userId)
        return "ok"
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