import { Inject, Injectable } from "@nestjs/common";
import { USER_CLASSROOM_REPOSITORY, type UserClassRepository } from "../../domain/ports/user-classroom.repository";
import { GOOGLE_CLASSROOM_CLIENT, type GoogleClassroomClient } from "../../domain/ports/google-classroom-client";
import { CLASSROOM_OWNER_QUERY, type ClassroomOwnerQuery } from "../../domain/ports/classroom-owner.query";
import { GOOGLE_ACCOUNT_PROVIDER, type GoogleAccountProviderClient } from "../../../accounts/domain/google-account-provider";
import { CLASSROOM_REPOSITORY, type ClassRoomRepository } from "../../domain/ports/classroom.repository";
import { UserRole } from "../../../users/domain/value-objects/user-role";


@Injectable()
export class AddUserToClassRoom{
    constructor(
        @Inject(USER_CLASSROOM_REPOSITORY) private readonly userToClassroom: UserClassRepository,
        @Inject(GOOGLE_CLASSROOM_CLIENT) private readonly googleClassroom: GoogleClassroomClient,
        @Inject(CLASSROOM_REPOSITORY) private readonly classRoomRepository: ClassRoomRepository,
        @Inject(CLASSROOM_OWNER_QUERY) private readonly classroomQuery: ClassroomOwnerQuery,
        @Inject(GOOGLE_ACCOUNT_PROVIDER) private readonly accountProvider: GoogleAccountProviderClient
    ){}

    async execute(userId: string, classRoomId: string){
        const data = await this.classroomQuery.findByUserId(userId)

        const exists = await this.userToClassroom.getUserToClassroom(userId, classRoomId)

        if(exists){
            throw new Error("Relation already exists")
        }

        if(!data){
            throw new Error("User and account not found")
        }

        if(!data.googleExternalId){
            throw new Error("Google Id or email must be provided")
        }

        const classRoom = await this.classRoomRepository.findById(classRoomId)

        if(!classRoom || !classRoom.externalId){
            throw new Error("Classroom doesnot exists or has not been created yet")
        }

        const userAccountExists = await this.accountProvider.findAccount(data.googleExternalId)

        if(!userAccountExists){
            throw new Error("User account doesnot exists")
        }

        if(data.role !== UserRole.ALUNO){
            throw new Error("Only students must be able to be added into a classroom")
        }

        const classRoomClassExistis = await this.googleClassroom.findClassroom(classRoom.externalId)

        if(!classRoomClassExistis){
            throw new Error("Classroom doesnot exists")
        }

        await this.googleClassroom.addStudent(classRoom.externalId, userAccountExists.email)

        await this.userToClassroom.saveUserToClassroom(data.userId, classRoom.id)
    }
}