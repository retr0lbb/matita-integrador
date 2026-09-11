import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UnitRepository } from "../domain/unity.repository";
import { DRIZZLE } from "../../database/providers/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Unit } from "../domain/unit.entity";
import { unitTable } from "../../database/schemas/unitSchema";
import { eq } from "drizzle-orm";

@Injectable()
export class DrizzleUnitRepository implements UnitRepository{
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ){}

    async save(unit: Unit): Promise<void> {
        await this.db.insert(unitTable).values({
            alias: unit.alias,
            externalId: unit.externalId,
            institutionId: unit.institutionId,
            address: unit.address,
            id: unit.id
        })
    }

    async findById(id: string): Promise<Unit | null> {
        const [unit] = await this.db.select().from(unitTable).where(eq(unitTable.id, id))

        if(!unit){
            throw new Error("Unit not found")
        }

        const model = Unit.create({
            address: unit.address,
            alias: unit.alias,
            externalId: unit.externalId,
            id: unit.id,
            institutionId: unit.institutionId
        })

        return model

    }

    async findByExternalId(externalId: string): Promise<Unit | null> {
        const [unit] = await this.db.select().from(unitTable).where(eq(unitTable.externalId, externalId))

        if(!unit){
            throw new Error("Unit not found")
        }

        const model = Unit.create({
            address: unit.address,
            alias: unit.alias,
            externalId: unit.externalId,
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
            externalId: unit.externalId,
            id: unit.id,
            institutionId: unit.institutionId
        }))

        return models
    }
}