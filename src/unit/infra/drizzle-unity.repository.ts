import { Inject, Injectable } from "@nestjs/common";
import { UnitRepository } from "../domain/unity.repository";
import { DRIZZLE } from "../../database/providers/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Unit } from "../domain/unit.entity";
import { unitTable } from "../../database/schemas/unitSchema";
import { eq } from "drizzle-orm";
import { UnitNotFound } from "../domain/errors/unit-not-found";
import { Classroom, ClassroomStatus } from "../../classroom/domain/classroom.entity";
import { classroomExternalLinkTable } from "../../database/schemas/externalLinksSchema";
import { alias } from "drizzle-orm/pg-core";
import { classRoomTable } from "../../database/schemas/classRoomSchema";

@Injectable()
export class DrizzleUnitRepository implements UnitRepository{
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ){}


    async listUnitClassrooms(unitId: string): Promise<Classroom[]> {
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
            ).where(
                eq(classRoomTable.unitId, unitId)
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

    async save(unit: Unit): Promise<void> {
        await this.db.insert(unitTable).values({
            alias: unit.alias,
            institutionId: unit.institutionId,
            address: unit.address,
            id: unit.id
        })
    }

    async findById(id: string): Promise<Unit | null> {
        const [unit] = await this.db.select().from(unitTable).where(eq(unitTable.id, id))

        if(!unit){
            throw new UnitNotFound()
        }

        const model = Unit.create({
            address: unit.address,
            alias: unit.alias,
            id: unit.id,
            institutionId: unit.institutionId
        })

        return model

    }

    async listUnity(): Promise<Unit[]> {
        const units = await this.db.select().from(unitTable)

        const models = units.map(unit => Unit.create({
            address: unit.address,
            alias: unit.alias,
            id: unit.id,
            institutionId: unit.institutionId
        }))

        return models
    }
}