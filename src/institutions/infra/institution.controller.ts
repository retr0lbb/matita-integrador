import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateInstitutionUseCase } from "../domain/usecases/create-institution";
import { listInstitutionsUseCase } from "../domain/usecases/list-institutions";


@Controller("institution")
export class InstitutionController{
    constructor(
        private readonly createUseCase: CreateInstitutionUseCase,
        private readonly listInstitutionsUseCase: listInstitutionsUseCase
    ){}

    @Post()
    async createInstitution(@Body() body: {name: string, apiKey: string}){
        await this.createUseCase.execute(body)
        return "ok"
    }

    @Get()
    async listAllInstitutions(){
        return await this.listInstitutionsUseCase.execute()
    }
}