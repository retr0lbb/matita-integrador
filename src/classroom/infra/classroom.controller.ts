import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";
import { CreateClassRoomUseCase, type CreateClassRoomUseCasePayload } from "../domain/useCases/create-classroom.usecase";
import { AddUserToClassRoom } from "../domain/useCases/add-user-to-classroom.usecase";

@Controller()
export class ClassroomController{
    constructor(
        private readonly createUseCase: CreateClassRoomUseCase,
        private readonly addUserToClass: AddUserToClassRoom
    ){}

    @Post("/unit/:unitId/classroom")
    async createClassRoom(@Param("unitId") unitId: string, @Body() body: CreateClassRoomUseCasePayload){
        if(!unitId){
            throw new BadRequestException("UNIT ID NOT PROVIDED")
        }
        await this.createUseCase.execute(unitId, body)
    }

    @Post("/classroom/:id/add")
    async addUserToClassRoom(@Param("id") classRoomId: string, @Body() body: {userId: string}){
        await this.addUserToClass.execute(body.userId, classRoomId)

        return "user added correctly"
    }
}