import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClassRoomRepository } from "../domain/ports/classroom.repository";
import { Classroom, ClassroomStatus } from "../domain/classroom.entity";
import { DRIZZLE } from "../../database/providers/drizzle.provider";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { classRoomTable } from "../../database/schemas/classRoomSchema";
import { and, eq } from "drizzle-orm";
import { usersTable } from "../../database/schemas/userSchema";
import { classRoomUsersTable } from "../../database/schemas/classroomUsers";
import { ClassroomOwner, ClassroomOwnerQuery } from "../domain/ports/classroom-owner.query";
import { accountTable } from "../../database/schemas/accountSchema";
import { UserRole } from "../../users/domain/value-objects/user-role";
import { UserClassRepository, UserClassroomRelation } from "../domain/ports/user-classroom.repository";
import { ClassNotActiveError } from "../domain/errors/class-not-active";
import { UserAlreadyInClass } from "../domain/errors/user-already-in-class";


@Injectable()
export class DrizzleClassroomRepository implements ClassRoomRepository,UserClassRepository, ClassroomOwnerQuery{
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ){}
    
    async getUserToClassroom(userId: string, classroomId: string): Promise<UserClassroomRelation | null> {
        const [exist] = await this.db.select().from(classRoomUsersTable)
        .where(and(
            eq(classRoomUsersTable.userId, userId),
            eq(classRoomUsersTable.classRoomId, classroomId)            
        ))
        
        return exist
    }

    async saveUserToClassroom(userId: string, classroomId: string): Promise<void> {
        await this.db.insert(classRoomUsersTable).values({
            classRoomId: classroomId,
            userId: userId,
            status: "DONE" //mudar para modelo dps
        })
    }

    async findByUserId(userId: string): Promise<ClassroomOwner | null> {
        const [user] = await this.db
        .select()
        .from(usersTable)
        .leftJoin(accountTable, eq(usersTable.id, accountTable.userId))
        .where(eq(usersTable.id, userId))

        if(!user.accounts || user.accounts.externalId === null){
            throw new Error("Account not found")
        }

        if(!user.users){
            throw new Error("User not found")
        }

        return {
            accountId: user.accounts.id,
            googleExternalId: user.accounts.externalId,
            role: user.users.role as UserRole,
            userId: user.users.id
        }
    }

    async save(classroom: Classroom): Promise<void> {
        await this.db.insert(classRoomTable).values({
            title: classroom.title,
            unitId: classroom.unitId,
            externalId:  classroom.externalId,
            id:  classroom.id,
            googleClassroomId: classroom.googleExternalId,
            status: classroom.status,
            ownerId: classroom.ownerId
        }).onConflictDoUpdate({
            target: classRoomTable.id,
            set: {
                title: classroom.title,
                unitId: classroom.unitId,
                externalId: classroom.externalId,
                googleClassroomId: classroom.googleExternalId,
                status: classroom.status,
                ownerId: classroom.ownerId,
            }
        })
    }

    async findById(id: string): Promise<Classroom | null> {
        const [classroom] = await this.db.select().from(classRoomTable)
        .where(eq(classRoomTable.id, id))

        if(!classroom){
            throw new Error("Classroom not found")
        }

        return Classroom.reconstitute({
            externalId: classroom.externalId, 
            id: classroom.id, 
            status: classroom.status as ClassroomStatus,
            title: classroom.title,
            googleExternalId: classroom.googleClassroomId,
            unitId: classroom.unitId,
            ownerId: classroom.ownerId
        })
    }
    
    findByProviderExternalId(id: string): Promise<Classroom | null> {
        throw new Error("Method not implemented.");
    }
    
    async listClassrooms(): Promise<Classroom[]> {
        const classRooms = await this.db.select().from(classRoomTable)

        return classRooms.map((classroom) => Classroom.reconstitute({
            externalId: classroom.externalId, 
            id: classroom.id, 
            status: classroom.status as ClassroomStatus,
            title: classroom.title,
            unitId: classroom.unitId,
            googleExternalId: classroom.googleClassroomId,
            ownerId: classroom.ownerId
        }))
    }

    async addUserToClassRoom(userId: string, classroomId: string): Promise<void> {
        const [user] = await this.db.select().from(usersTable).where(eq(usersTable.id, userId))

        if(!user){
            throw new NotFoundException("user not found")
        }

        const [classRoom] = await this.db.select().from(classRoomTable).where(eq(classRoomTable.id, classroomId))

        if(!classRoom){
            throw new NotFoundException("Class not found")
        }

        if(classRoom.status === "INACTIVE"){
            throw new ClassNotActiveError()
        }

        const [relation] = await this.db.select()
            .from(classRoomUsersTable)
            .where(and(
                eq(classRoomUsersTable.classRoomId, classroomId),
                eq(classRoomUsersTable.userId, userId)
            ))

        if(relation){
            throw new UserAlreadyInClass()
        }

        await this.db.insert(classRoomUsersTable).values({
            classRoomId: classRoom.id,
            userId: user.id
        })
    }

    async removeUserFromClassroom(userId: string, classroomId: string): Promise<void> {
        const [relation] = await this.db.select()
            .from(classRoomUsersTable)
            .where(and(
                eq(classRoomUsersTable.classRoomId, classroomId),
                eq(classRoomUsersTable.userId, userId)
            ))

        if(!relation){
            return
        }

        await this.db
            .delete(classRoomUsersTable)
            .where(eq(classRoomUsersTable.id, relation.id))
    }

}