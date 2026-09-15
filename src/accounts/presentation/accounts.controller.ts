import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { CreateUserAccountUseCase } from "../app/create-account.usecase";
import { DeleteAccountUseCase } from "../app/delete-account.usecase";

@Controller("/accounts")
export class AccountsController{
    constructor(
        private readonly createUserAccountUseCase: CreateUserAccountUseCase,
        private readonly deleteUserAccountUseCase: DeleteAccountUseCase
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
}