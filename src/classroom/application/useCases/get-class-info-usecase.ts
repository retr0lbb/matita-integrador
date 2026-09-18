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

        const students = await this.classRepo.getClassStudents(classroom);
        const accounts = await this.userAccountRepo.findByUserIdsAndProvider(
            students.map((student) => student.id),
            ExternalProvider.GOOGLE,
        );

        const accountByUserId = new Map(accounts.map((account) => [account.userId, account]));

        return{
            id: classroom.id,
            title: classroom.title,
            externalId: classroom.externalId,
            googleId: classroom.googleExternalId,
            unitId: classroom.unitId,
            status: classroom.status,      
            ownerId: classroom.ownerId,
            users: students.map((student) => ({
                userId: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                role: student.role,
                account: accountByUserId.get(student.id) ?? null,
            })),
            createdAT: classroom.createdAt
        }
    }
}