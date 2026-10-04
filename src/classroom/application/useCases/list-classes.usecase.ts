import { Inject, Injectable } from "@nestjs/common";
import { CLASSROOM_REPOSITORY,type ClassRoomRepository } from "../../domain/ports/classroom.repository";
import { UNIT_REPOSITORY, type UnitRepository } from "../../../unit/domain/unity.repository";
import { UnitNotFound } from "../../../unit/domain/errors/unit-not-found";
import { ClassroomStatus } from "../../domain/classroom.entity";
import { ListQueryParams } from "../../infra/classroom.controller";



@Injectable()
export class ListUnitClassesUseCase{
    constructor(
        @Inject(CLASSROOM_REPOSITORY) private readonly classroomRepo: ClassRoomRepository,
        @Inject(UNIT_REPOSITORY) private readonly unitRepo: UnitRepository
    ){}

    async execute(unitId: string, params: ListQueryParams){
        const unit = await this.unitRepo.findById(unitId)

        if(!unit){
            throw new UnitNotFound()
        }

        const classRooms = await this.classroomRepo.listUnitClassrooms(unitId)

        const mappedClassrooms = classRooms.map(classroom => ({
            id: classroom.id,
            title: classroom.title,
            clasroomId: classroom.googleExternalId,
            status: classroom.status,
            createdAt: classroom.createdAt
        }))

        return !params.showInactive? mappedClassrooms.filter(a => a.status !== ClassroomStatus.INACTIVE): mappedClassrooms
    }
}