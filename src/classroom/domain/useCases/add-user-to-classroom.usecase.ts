import { Inject, Injectable } from "@nestjs/common";
import { USER_CLASSROOM_REPOSITORY, type UserClassRepository } from "../user-classroom.repository";
import { GOOGLE_CLASSROOM_CLIENT, type GoogleClassroomClient } from "../ports/google-classroom-client";


@Injectable()
export class AddUserToClassRoom{
    constructor(
        @Inject(USER_CLASSROOM_REPOSITORY) private readonly unityRepository: UserClassRepository,
        @Inject(GOOGLE_CLASSROOM_CLIENT) private readonly googleClassroom: GoogleClassroomClient
    ){}

    async execute(userId: string, classRoomId: string){
        await this.unityRepository.addUserToClassRoom(userId, classRoomId)
    }
}