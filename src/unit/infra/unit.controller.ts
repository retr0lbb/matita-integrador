import { Body, Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { type CreateUnitUseCasePayload, CreateUnityUseCase } from "../domain/usecase/create-unit.usecase";
import { LinkUnitToGoogle } from "../domain/usecase/link-unit-google";

@Controller("/unit")
export class UnitController{
    constructor(
        private readonly createUnitUseCase: CreateUnityUseCase,
        private readonly linkUnitToGoogleUsecase: LinkUnitToGoogle
    ){}

    @Post()
    async createUnit(@Body() body: CreateUnitUseCasePayload){
        await this.createUnitUseCase.execute(body)

        return "ok"
    }

    @Post("/:unitId/link/google")
    @HttpCode(HttpStatus.CREATED)
    async linkUnit(@Param("unitId") unitId: string){
        const path = await this.linkUnitToGoogleUsecase.execute(unitId, "MANUAL")

        return {message: `Unidade criada path: ${path}`}
    }

}