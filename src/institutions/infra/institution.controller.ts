import { Body, Controller, Post } from "@nestjs/common";
import { CreateInstitutionUseCase } from "../domain/usecases/create-institution";


@Controller("institution")
export class InstitutionController{
    constructor(
        private readonly createUseCase: CreateInstitutionUseCase
    ){}

    @Post()
    async createInstitution(@Body() body: {name: string, apiKey: string}){
        await this.createUseCase.execute(body)
        return "ok"
    }
}