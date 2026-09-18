import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CLASSROOM_REPOSITORY, type ClassRoomRepository } from "../../domain/ports/classroom.repository";
import { UNIT_REPOSITORY, type UnitRepository } from "../../../unit/domain/unity.repository";
import { Classroom, ClassroomStatus } from "../../domain/classroom.entity";
import { randomUUID } from "crypto";
import { GOOGLE_CLASSROOM_CLIENT, type GoogleClassroomClient } from "../../domain/ports/google-classroom-client";
import { GOOGLE_ACCOUNT_PROVIDER, type GoogleAccountProviderClient } from "../../../accounts/domain/google-account-provider";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../../../accounts/domain/account.repository";
import { USER_REPOSITORY, type UserRepository } from "../../../users/domain/user.repository";
import { UserRole } from "../../../users/domain/value-objects/user-role";


export type CreateClassRoomUseCasePayload = {
    title: string,
    location?: string,
    ownerAccountId: string,
    status?: ClassroomStatus,
}

@Injectable()
export class CreateClassRoomUseCase{
    constructor(
        @Inject(CLASSROOM_REPOSITORY) private readonly classRoomRepository: ClassRoomRepository,
        @Inject(UNIT_REPOSITORY) private readonly unityRepository: UnitRepository,
        @Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: AccountRepository,
        @Inject(GOOGLE_ACCOUNT_PROVIDER) private readonly googleAccountProvider: GoogleAccountProviderClient,
        @Inject(GOOGLE_CLASSROOM_CLIENT) private readonly classroomClient: GoogleClassroomClient,
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
    ){}

    async execute(unitId: string, payload: CreateClassRoomUseCasePayload){
        const unity = await this.unityRepository.findById(unitId)
        
        if(!unity){
            throw new NotFoundException("Unity Not Found")
        }

        const status = ClassroomStatus.INACTIVE

        const account = await this.accountRepository.findById(payload.ownerAccountId)

        if(!account){
            throw new Error("You must provide a valid account")
        }

        const userFromAccount = await this.userRepository.findById(account.userId)

        if(!userFromAccount){
            throw new Error("User not found")
        }

        if(userFromAccount.role === UserRole.ALUNO){
            throw new ForbiddenException("User from role ALUNO cannot create a classroom")
        }

        const classroom = Classroom.create({
            externalId: null,
            id: randomUUID(),
            location: payload.location ?? null,
            status,
            title: payload.title,
            unitId,
            ownerId: account.id
        })

        await this.classRoomRepository.save(classroom)

        if(!account.email){
            throw new Error("Cannot create a classroom without google account")
        }

        const googleAccount = await this.googleAccountProvider.findAccount(account.email.getValue())


        if(googleAccount === null){
            throw new NotFoundException("Google Account not found")
        }

        const googleClassRoomId = await this.classroomClient.createCourse({
            name: payload.title, 
            ownerEmail: googleAccount.email
        })

        classroom.activate(googleClassRoomId)

        await this.classRoomRepository.save(classroom)

    }
}