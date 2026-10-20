import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateInstitutionUseCase } from "../domain/usecases/create-institution";
import { listInstitutionsUseCase } from "../domain/usecases/list-institutions";
import { ListInstitutionsUnitsUseCase } from "../domain/usecases/get-institution-units";


@Controller("institution")
export class InstitutionController{
    constructor(
        private readonly createUseCase: CreateInstitutionUseCase,
        private readonly listInstitutionsUseCase: listInstitutionsUseCase,
        private readonly listInstitutionUnitsUseCase: ListInstitutionsUnitsUseCase
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

    @Get("/:institutionId/units")
    async getAllUnitsFromInstitution(@Param("institutionId") institutionId: string){
        return await this.listInstitutionUnitsUseCase.execute(institutionId)
    }
}