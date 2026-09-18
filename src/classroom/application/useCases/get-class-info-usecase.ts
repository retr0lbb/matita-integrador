import { Inject } from "@nestjs/common";
import { CLASSROOM_REPOSITORY, type ClassRoomRepository } from "../../domain/ports/classroom.repository";
import { GOOGLE_CLASSROOM_CLIENT, type GoogleClassroomClient } from "../../domain/ports/google-classroom-client";
import { ClassroomNotFoun } from "../../domain/errors/class-not-found";
import { USER_AND_ACCOUNT_PROVIDER, type UserAndAccountProvider } from "../../../accounts/domain/user-and-account.port";
import { ExternalProvider } from "../../../accounts/domain/account.entity";

export class GetClassInfoUseCase{
    constructor(
        @Inject(CLASSROOM_REPOSITORY) private readonly classRepo: ClassRoomRepository,
        @Inject(USER_AND_ACCOUNT_PROVIDER) private readonly userAccountRepo: UserAndAccountProvider,
        @Inject(GOOGLE_CLASSROOM_CLIENT) private readonly googleClass: GoogleClassroomClient,
    ){}

    async execute(classId: string){
        const classroom = await this.classRepo.findById(classId)

        if(!classroom){
            throw new ClassroomNotFoun()
        }

        const classRoomStudents = await this.classRepo.getClassStudents(classroom)
        const studentAccounts = await this.userAccountRepo.findByUserIdsAndProvider(classRoomStudents, ExternalProvider.GOOGLE)

        return{
            id: classroom.id,
            title: classroom.title,
            externalId: classroom.externalId,
            googleId: classroom.googleExternalId,
            unitId: classroom.unitId,
            status: classroom.status,      
            ownerId: classroom.ownerId,
            users: studentAccounts,
            createdAT: classroom.createdAt
        }
    }
}