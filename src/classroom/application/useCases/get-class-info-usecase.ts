import { Inject } from "@nestjs/common";
import { CLASSROOM_REPOSITORY, type ClassRoomRepository } from "../../domain/ports/classroom.repository";
import { GOOGLE_CLASSROOM_CLIENT, type GoogleClassroomClient } from "../../domain/ports/google-classroom-client";
import { ClassroomNotFound } from "../../domain/errors/class-not-found";
import { USER_AND_ACCOUNT_PROVIDER, type UserAndAccountProvider } from "../../../accounts/domain/user-and-account.port";
import { ExternalProvider } from "../../../accounts/domain/account.entity";
import { privateDecrypt } from "crypto";
import { USER_CLASSROOM_REPOSITORY, type UserClassRepository } from "../../domain/ports/user-classroom.repository";

export class GetClassInfoUseCase{
    constructor(
        @Inject(CLASSROOM_REPOSITORY) private readonly classRepo: ClassRoomRepository,
        @Inject(USER_CLASSROOM_REPOSITORY) private readonly userToClass: UserClassRepository,
        @Inject(USER_AND_ACCOUNT_PROVIDER) private readonly userAccountRepo: UserAndAccountProvider,
        @Inject(GOOGLE_CLASSROOM_CLIENT) private readonly googleClass: GoogleClassroomClient,
    ){}

    async execute(classId: string){
        const classroom = await this.classRepo.findClassroomById(classId)

        if(!classroom){
            throw new ClassroomNotFound()
        }

        const students = await this.userToClass.getClassStudents(classroom);
        const accounts = await this.userAccountRepo.findByUserIdsAndProvider(
            students.map((student) => student.id),
            ExternalProvider.GOOGLE,
        );

        const accountByUserId = new Map(accounts.map((account) => [account.userId, account]));

        return{
            id: classroom.id,
            title: classroom.title,
            lexId: classroom.lexId,
            googleId: classroom.googleId,
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