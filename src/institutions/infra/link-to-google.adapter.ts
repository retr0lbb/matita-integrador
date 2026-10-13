import { Inject, Injectable } from "@nestjs/common";
import { ConnectInstitution, InstitutionLinkPort } from "../domain/institutions-link";
import { DRIZZLE } from "../../database/providers/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { institutionTable } from "../../database/schemas/institutionSchema";
import { and, eq, isNotNull, not } from "drizzle-orm";
import { InstitutionNotFound } from "../domain/errors/institution-not-found";
import { institutionIntegrationTable } from "../../database/schemas/externalLinksSchema";
import { InstitutionLinkAlreadyExists } from "../domain/errors/institution-link-already-exists";



@Injectable()
export class LinkToGoogleAdapter implements InstitutionLinkPort{
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ){}

    async connectInstitution(data: ConnectInstitution): Promise<void> {
        const [institution] = await this.db.select()
            .from(institutionTable)
            .where(eq(
                institutionTable.id,
                data.institutionId
            ))

        if(!institution){
            throw new InstitutionNotFound()
        }

        const [link] = await this.db.select()
        .from(institutionIntegrationTable)
        .where(
            and(
                and(
                    eq(institutionIntegrationTable.provider, "GOOGLE"),
                    isNotNull(institutionIntegrationTable.externalId),
                ),
                eq(institutionIntegrationTable.institutionId, data.institutionId)
            )
        )

        if(link){
            throw new InstitutionLinkAlreadyExists()
        }

        //aqui entra algum service de google
    }
}