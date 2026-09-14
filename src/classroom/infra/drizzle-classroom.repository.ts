import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClassRoomRepository } from "../domain/ports/classroom.repository";
import { Classroom, ClassRoomShift, ClassroomStatus } from "../domain/classroom.entity";
import { DRIZZLE } from "../../database/providers/drizzle.provider";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { classRoomTable } from "../../database/schemas/classRoomSchema";
import { and, eq } from "drizzle-orm";
import { UserClassRepository } from "../domain/ports/user-classroom.repository";
import { usersTable } from "../../database/schemas/userSchema";
import { classRoomUsersTable } from "../../database/schemas/classroomUsers";
import { ClassroomOwner, ClassroomOwnerQuery } from "../domain/ports/classroom-owner.query";
import { accountTable } from "../../database/schemas/accountSchema";
import { UserRole } from "../../users/domain/value-objects/user-role";


@Injectable()
export class DrizzleClassroomRepository implements ClassRoomRepository, 
UserClassRepository, ClassroomOwnerQuery{
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ){}

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
            location: classroom.location,
            shift: classroom.shift,
            status: classroom.status
        })
    }

    async findById(id: string): Promise<Classroom | null> {
        const [classroom] = await this.db.select().from(classRoomTable)
        .where(eq(classRoomTable.id, id))

        if(!classroom){
            throw new Error("Classroom not found")
        }

        return Classroom.create({
            externalId: classroom.externalId, 
            id: classroom.id, 
            location: classroom.location,
            shift: classroom.shift as ClassRoomShift,
            status: classroom.status as ClassroomStatus,
            title: classroom.title,
            unitId: classroom.unitId
        })
    }
    
    findByProviderExternalId(id: string): Promise<Classroom | null> {
        throw new Error("Method not implemented.");
    }
    
    async listClassrooms(): Promise<Classroom[]> {
        const classRooms = await this.db.select().from(classRoomTable)

        return classRooms.map((classroom) => Classroom.create({
            externalId: classroom.externalId, 
            id: classroom.id, 
            location: classroom.location,
            shift: classroom.shift as ClassRoomShift,
            status: classroom.status as ClassroomStatus,
            title: classroom.title,
            unitId: classroom.unitId
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
            throw new BadRequestException("ClassRoom Inactive please activate this classroom before it works")
        }

        const [relation] = await this.db.select()
            .from(classRoomUsersTable)
            .where(and(
                eq(classRoomUsersTable.classRoomId, classroomId),
                eq(classRoomUsersTable.userId, userId)
            ))

        if(relation){
            throw new BadRequestException("User Already in this classRoom")
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