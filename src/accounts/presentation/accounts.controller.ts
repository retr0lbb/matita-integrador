import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserAccountUseCase } from "../app/create-account.usecase";

@Controller("/accounts")
export class AccountsController{
    constructor(
        private readonly createUserAccountUseCase: CreateUserAccountUseCase
    ){}

    @Post()
    async createUserAccount(@Body() payload: {userId: string} ){
        console.log(payload)
        await this.createUserAccountUseCase.execute(payload.userId)
        return "ok"
    }
}