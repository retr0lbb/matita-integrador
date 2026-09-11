import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CLASSROOM_REPOSITORY, type ClassRoomRepository } from "../classroom.repository";
import { UNIT_REPOSITORY, type UnitRepository } from "../../../unit/domain/unity.repository";
import { Classroom, ClassRoomShift, ClassroomStatus } from "../classroom.entity";
import { classRoomStatus } from "../../../database/schemas/classRoomSchema";
import { randomUUID } from "crypto";


export type CreateClassRoomUseCasePayload = {
    externalId: string | null,
    title: string,
    location: string | null,
    shift?: ClassRoomShift,
    status?: ClassroomStatus,
}

@Injectable()
export class CreateClassRoomUseCase{
    constructor(
        @Inject(CLASSROOM_REPOSITORY) private readonly classRoomRepository: ClassRoomRepository,
        @Inject(UNIT_REPOSITORY) private readonly unityRepository: UnitRepository 
    ){}

    async execute(unitId: string, payload: CreateClassRoomUseCasePayload){
        const unity = await this.unityRepository.findById(unitId)
        
        if(!unity){
            throw new NotFoundException("Unity Not Found")
        }

        const shift = payload.shift? ClassRoomShift[payload.shift]: ClassRoomShift.MORNING
        const status = payload.status? ClassroomStatus[payload.status]: ClassroomStatus.ACTIVE

        const classroom = Classroom.create({
            externalId: payload.externalId,
            id: randomUUID(),
            location: payload.location,
            shift,
            status,
            title: payload.title,
            unitId
        })

        await this.classRoomRepository.save(classroom)
    }
}