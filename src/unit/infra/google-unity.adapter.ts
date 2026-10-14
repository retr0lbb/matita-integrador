import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { admin_directory_v1, google } from "googleapis";
import { GoogleUnitPort } from "../domain/google.unit.part";
import { Unit } from "../domain/unit.entity";
import { DRIZZLE } from "../../database/providers/drizzle.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { unitExternalLinkTable } from "../../database/schemas/externalLinksSchema";

@Injectable()
export class GoogleUnitAdapter implements GoogleUnitPort{    
    private readonly credentials: { client_email: string; private_key: string };

    constructor(
        private readonly configService: ConfigService,
        @Inject(DRIZZLE) private readonly db: NodePgDatabase
    ) {
        this.credentials = JSON.parse(this.configService.getOrThrow<string>("GOOGLE_API_JSON"));
    }

    private directoryFor(adminEmail: string): admin_directory_v1.Admin{
        const auth = new google.auth.JWT({
            email: this.credentials.client_email,
            key: this.credentials.private_key,
            subject: adminEmail,
            scopes: [
                "https://www.googleapis.com/auth/admin.directory.orgunit",
            ]
        })

        return google.admin({version: "directory_v1", auth})
    }

    async createOrgUnit(name: string, parentOrgUnitPath: string, adminDirectory: admin_directory_v1.Admin, description?: string): Promise<{path: string, id: string}> {
        const response = await adminDirectory.orgunits.insert({
            customerId: "my_customer",
            requestBody: {
                name,
                parentOrgUnitPath,
                description,
            }
        })

        const {orgUnitPath, orgUnitId} = response.data

        if (!orgUnitPath) {
            throw new Error(
                `O Google não retornou o caminho da OU "${name}"`,
            );
        }

        if(!orgUnitId){
            throw new Error(
                `O Google não retornou o ID da OU "${name}"`,
            );
        }

        return {path: orgUnitPath, id: orgUnitId}
    }

    async create(unit: Unit, origin: "MANUAL" | "SYNC" | "AUTO_MATCH"){
        const adminDirectory = this.directoryFor(this.configService.getOrThrow("GOOGLE_CLIENT_EMAIL"))
        let rootPath = this.configService.get<string>(
            "GOOGLE_ROOT_ORG_UNIT_PATH",
        );

        if(!rootPath){
            rootPath = "/Integrador-teste"
        }

        const data = await this.createOrgUnit(
            unit.alias, 
            rootPath, 
            adminDirectory, 
            `Unidade Organizacional para ${unit.alias} da instituição com o id: ${unit.institutionId}`
        )

        await Promise.all([
            await this.createOrgUnit(
                "ALUNOS",
                data.path,
                adminDirectory,
                "Contas de alunos ATIVOS",
            ),

            await this.createOrgUnit(
                "PROFESSORES",
                data.path,
                adminDirectory,
                "Contas de professores ativos ATIVOS",
            ),

            await this.createOrgUnit(
                "INATIVOS",
                data.path,
                adminDirectory,
                "Contas de usuarios Excluidos ou inativos",
            )
        ])

        await this.db.insert(unitExternalLinkTable).values({
            externalPath: data.path,
            provider: "GOOGLE",
            origin: origin,
            unitId: unit.id,
            externalId: data.id
        })

        return data.path
    }

}