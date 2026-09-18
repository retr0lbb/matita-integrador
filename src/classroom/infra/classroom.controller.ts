import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateClassRoomUseCase, type CreateClassRoomUseCasePayload } from "../application/useCases/create-classroom.usecase";
import { AddUserToClassRoom } from "../application/useCases/add-user-to-classroom.usecase";
import { DeleteClassRoomUsecase } from "../application/useCases/delete-classroom.usecase";
import { ListUnitClassesUseCase } from "../application/useCases/list-classes.usecase";
import { GetClassInfoUseCase } from "../application/useCases/get-class-info-usecase";

@Controller()
export class ClassroomController{
    constructor(
        private readonly createUseCase: CreateClassRoomUseCase,
        private readonly addUserToClass: AddUserToClassRoom,
        private readonly archiveClass: DeleteClassRoomUsecase,
        private readonly listUnitClass: ListUnitClassesUseCase,
        private readonly getClass: GetClassInfoUseCase
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
    }

    @Delete("/classroom/:id")
    async archiveClassroom(@Param("id") classroomId: string){
        await this.archiveClass.execute(classroomId)
    }

    @Get("/classroom/:id")
    async getClassRoute(@Param("id") classroomId: string){
        return await this.getClass.execute(classroomId)
    }

    @Get("/unit/:unitId/classroom")
    async listUnitClassroom(@Param("unitId") unitId: string){
        return await this.listUnitClass.execute(unitId)
    }
}