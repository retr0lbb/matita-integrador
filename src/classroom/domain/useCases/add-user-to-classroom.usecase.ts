import { Inject, Injectable } from "@nestjs/common";
import { USER_CLASSROOM_REPOSITORY, type UserClassRepository } from "../user-classroom.repository";


@Injectable()
export class AddUserToClassRoom{
    constructor(
        @Inject(USER_CLASSROOM_REPOSITORY) private readonly unityRepository: UserClassRepository 
    ){}

    async execute(userId: string, classRoomId: string){
        await this.unityRepository.addUserToClassRoom(userId, classRoomId)
    }
}