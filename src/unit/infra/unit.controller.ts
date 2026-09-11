import { Body, Controller, Post } from "@nestjs/common";
import { type CreateUnitUseCasePayload, CreateUnityUseCase } from "../domain/usecase/create-unit.usecase";

@Controller("/unit")
export class UnitController{
    constructor(
        private readonly createUnitUseCase: CreateUnityUseCase
    ){}

    @Post()
    async createUnit(@Body() body: CreateUnitUseCasePayload){
        await this.createUnitUseCase.execute(body)

        return "ok"
    }

}