import { Body, Controller, Post } from "@nestjs/common";
import { type CreateUserInput, CreateUserUseCase } from "../app/create-user/create-user.usecase";

@Controller("/user")
export class UserController{
    constructor(private readonly createUseCase: CreateUserUseCase){}

    @Post()
    async createUser(@Body() body: CreateUserInput){
        const user = await this.createUseCase.execute(body)

        return user
    }
}