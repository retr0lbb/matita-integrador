import { Inject, Injectable } from "@nestjs/common";
import { ClassRoomRepository } from "../domain/classroom.repository";
import { Classroom, ClassRoomShift, ClassroomStatus } from "../domain/classroom.entity";
import { DRIZZLE } from "../../database/providers/drizzle.provider";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { classRoomTable } from "../../database/schemas/classRoomSchema";
import { eq } from "drizzle-orm";


@Injectable()
export class DrizzleClassroomRepository implements ClassRoomRepository{
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ){}

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

}