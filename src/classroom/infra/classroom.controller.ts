import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";
import { CreateClassRoomUseCase, type CreateClassRoomUseCasePayload } from "../domain/useCases/create-classroom.usecase";

@Controller()
export class ClassroomController{
    constructor(
        private readonly createUseCase: CreateClassRoomUseCase
    ){}

    @Post("/unit/:unitId/classroom")
    async createClassRoom(@Param("unitId") unitId: string, @Body() body: CreateClassRoomUseCasePayload){
        if(!unitId){
            throw new BadRequestException("UNIT ID NOT PROVIDED")
        }
        await this.createUseCase.execute(unitId, body)
    }
}