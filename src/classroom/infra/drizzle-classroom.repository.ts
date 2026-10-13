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
import { unitTable } from "../../database/schemas/unitSchema";
import { UnitNotFound } from "../../unit/domain/errors/unit-not-found";
import { User } from "../../users/domain/user.entity";
import { classroomExternalLinkTable } from "../../database/schemas/externalLinksSchema";
import { alias } from "drizzle-orm/pg-core";


@Injectable()
export class DrizzleClassroomRepository implements ClassRoomRepository, UserClassRepository, ClassroomOwnerQuery{
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ){}

    async findClassroomById(id: string): Promise<Classroom | null> {
        const [classroom] = await this.db.select().from(classRoomTable)
        .where(eq(classRoomTable.id, id))

        const [linkLex] = await this.db.select()
            .from(classroomExternalLinkTable)
            .where(and(
                eq(classroomExternalLinkTable.classroomId, id),
                eq(classroomExternalLinkTable.provider, "LEX")
            ))

        const [linkGoogle] = await this.db.select()
            .from(classroomExternalLinkTable)
            .where(and(
                eq(classroomExternalLinkTable.classroomId, id),
                eq(classroomExternalLinkTable.provider, "LEX")
            ))

        if(!classroom){
            throw new Error("Classroom not found")
        }

        return Classroom.reconstitute({
            id: classroom.id,
            ownerId: classroom.ownerId,
            status: classroom.status as ClassroomStatus,
            title: classroom.title,
            unitId: classroom.unitId,
            googleId: linkGoogle.id,
            lexId: linkLex.id
        })
    }

    async findByProviderExternalId(
        externalId: string,
        provider: "LEX" | "GOOGLE"
    ): Promise<Classroom | null> {
        const allClassroomLinks = alias(
            classroomExternalLinkTable,
            "all_classroom_links"
        );

        const results = await this.db
            .select({
                classroom: classRoomTable,
                link: allClassroomLinks,
            })
            .from(classroomExternalLinkTable)
            .innerJoin(
                classRoomTable,
                eq(classroomExternalLinkTable.classroomId, classRoomTable.id)
            )
            .leftJoin(
                allClassroomLinks,
                eq(allClassroomLinks.classroomId, classRoomTable.id)
            )
            .where(
                and(
                    eq(classroomExternalLinkTable.externalId, externalId),
                    eq(classroomExternalLinkTable.provider, provider)
                )
            );

        if (results.length === 0) {
            return null;
        }

        const { classroom } = results[0];

        const googleLink = results.find(
            ({ link }) => link?.provider === "GOOGLE"
        )?.link;

        const lexLink = results.find(
            ({ link }) => link?.provider === "LEX"
        )?.link;

        return Classroom.reconstitute({
            id: classroom.id,
            unitId: classroom.unitId,
            ownerId: classroom.ownerId,
            title: classroom.title,
            status: classroom.status as ClassroomStatus,
            googleId: googleLink?.externalId ?? null,
            lexId: lexLink?.externalId ?? null,
        });
    }
        
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
            status: "DONE"
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
            id:  classroom.id,
            status: classroom.status,
            ownerId: classroom.ownerId
        }).onConflictDoUpdate({
            target: classRoomTable.id,
            set: {
                title: classroom.title,
                unitId: classroom.unitId,
                status: classroom.status,
                ownerId: classroom.ownerId,
            }
        })

        if(classroom.lexId !== null){
            await this.db.insert(classroomExternalLinkTable).values({
                classroomId: classroom.id,
                origin: "MANUAL",
                provider: "LEX",
                externalId: classroom.lexId,
            })
        }

        if(classroom.googleId !== null){
            await this.db.insert(classroomExternalLinkTable).values({
                classroomId: classroom.id,
                externalId: classroom.googleId,
                origin: "MANUAL",
                provider: "GOOGLE"
            })
        }
    }
    
    async getClassStudents(classRoom: Classroom): Promise<User[]> {

        const classStudents = await this.db.select({user: usersTable})
        .from(classRoomUsersTable)
        .innerJoin(usersTable, eq(usersTable.id, classRoomUsersTable.userId))
        .where(
            eq(classRoomUsersTable.classRoomId, classRoom.id)
        )

        return classStudents.map(student => User.reconstitute({
            createdAt: student.user.createdAt,
            firstName: student.user.firstName,
            id: student.user.id,
            lastName: student.user.lastName,
            role: student.user.role as UserRole,
            updatedAt: student.user.updatedAt
        }))
    }

    async listClassrooms(): Promise<Classroom[]> {
        const externalLink = alias(
            classroomExternalLinkTable,
            "external_link"
        );

        const results = await this.db
            .select({
                classroom: classRoomTable,
                link: externalLink,
            })
            .from(classRoomTable)
            .leftJoin(
                externalLink,
                eq(externalLink.classroomId, classRoomTable.id)
            );

        const classroomsMap = new Map<string, Classroom>();

        for (const { classroom, link } of results) {
            let entity = classroomsMap.get(classroom.id);

            if (!entity) {
                entity = Classroom.reconstitute({
                    id: classroom.id,
                    status: classroom.status as ClassroomStatus,
                    title: classroom.title,
                    unitId: classroom.unitId,
                    ownerId: classroom.ownerId,
                    googleId: null,
                    lexId: null,
                });

                classroomsMap.set(classroom.id, entity);
            }

            if (link?.provider === "GOOGLE") {
                entity = Classroom.reconstitute({
                    id: classroom.id,
                    status: classroom.status as ClassroomStatus,
                    title: classroom.title,
                    unitId: classroom.unitId,
                    ownerId: classroom.ownerId,
                    googleId: link.externalId,
                    lexId: entity.lexId,
                });

                classroomsMap.set(classroom.id, entity);
            }

            if (link?.provider === "LEX") {
                entity = Classroom.reconstitute({
                    id: classroom.id,
                    status: classroom.status as ClassroomStatus,
                    title: classroom.title,
                    unitId: classroom.unitId,
                    ownerId: classroom.ownerId,
                    googleId: entity.googleId,
                    lexId: link.externalId,
                });

                classroomsMap.set(classroom.id, entity);
            }
        }

        return Array.from(classroomsMap.values());
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