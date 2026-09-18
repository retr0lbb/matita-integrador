import { Inject, Injectable } from "@nestjs/common";
import { GOOGLE_CLASSROOM_CLIENT,type GoogleClassroomClient } from "../../domain/ports/google-classroom-client";
import { CLASSROOM_REPOSITORY, type ClassRoomRepository } from "../../domain/ports/classroom.repository";


@Injectable()
export class DeleteClassRoomUsecase{
    constructor(
        @Inject(GOOGLE_CLASSROOM_CLIENT) private readonly googleClient: GoogleClassroomClient,
        @Inject(CLASSROOM_REPOSITORY) private readonly classroomRepo: ClassRoomRepository
    ){}

    async execute(classId: string){
        const classroom = await this.classroomRepo.findById(classId)
        if(!classroom){
            console.log("Classroom Not defined")
            return
        }

        if(classroom.externalId){
            await this.googleClient.archiveClassroom(classroom.externalId)
        }

        classroom.deactivate()

        await this.classroomRepo.save(classroom)

    }
}