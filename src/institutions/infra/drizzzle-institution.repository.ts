import { Inject, Injectable } from "@nestjs/common";
import { InstitutionRepository } from "../domain/institution.repository";
import { Institution } from "../domain/institution.entity";
import { DRIZZLE } from "../../database/providers/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { institutionTable } from "../../database/schemas/institutionSchema";
import { eq } from "drizzle-orm";


@Injectable()
export class DrizzleInstitutionRepository implements InstitutionRepository{

    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ){}

    async save(account: Institution): Promise<void> {
        await this.db.insert(institutionTable).values({
            apiKey: account.apiKey,
            name: account.name,
            id: account.id
        })
    }


    async findById(id: string): Promise<Institution | null> {
        const [inst] = await this.db.select().from(institutionTable).where(eq(institutionTable.id, id))

        if(!inst){
            throw new Error("Institution doesnot exists")
        }

        const model = Institution.create({
            id: inst.id,
            apiKey: inst.apiKey,
            name: inst.name
        })

        return model
    }

    async listInstitutions(): Promise<Institution[]> {
        const insts = await this.db.select().from(institutionTable)
        
        const models = insts.map(inst => Institution.create({id: inst.id, apiKey: inst.apiKey, name: inst.name}))

        return models
    }

    async findByApiKey(apiKey: string): Promise<Institution | null> {
        const [inst] = await this.db.select().from(institutionTable).where(eq(institutionTable.apiKey, apiKey))

        if(!inst){
            throw new Error("Institution doesnot exists")
        }

        const model = Institution.create({id: inst.id, apiKey: inst.apiKey, name: inst.name})

        return model
    }
}