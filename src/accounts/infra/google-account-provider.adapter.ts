import { Injectable } from "@nestjs/common";
import { CreateGoogleAccountInput, GoogleAccountObject, GoogleAccountProviderClient } from "../domain/google-account-provider";
import { ConfigService } from "@nestjs/config";
import { google, admin_directory_v1} from 'googleapis';
import { randomBytes } from "crypto";

@Injectable()
export class GoogleAccountAdapter implements GoogleAccountProviderClient {

    private readonly directory: admin_directory_v1.Admin;

    constructor(private readonly config: ConfigService){
        const json = config.getOrThrow<string>("GOOGLE_API_JSON")
        const creds = JSON.parse(json) //tipar essa porra dqui

        const auth = new google.auth.JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: [
                'https://www.googleapis.com/auth/admin.directory.user',
                "https://www.googleapis.com/auth/admin.directory.orgunit.readonly"
            ],
            subject: config.get<string>("GOOGLE_CLIENT_EMAIL"),
        });

        this.directory = google.admin({version: "directory_v1", auth})
    }

    async listOrgUnits() {
        const response = await this.directory.orgunits.list({
            customerId: "my_customer",
            type: "all",
        });

        return response.data.organizationUnits ?? [];
    }
    
    async listAllAccounts(orgUnitPath: string): Promise<Array<GoogleAccountObject>> {
        const accounts: Array<GoogleAccountObject> = [];
        let pageToken: string | undefined;

        // const ous = await this.listOrgUnits()

        // console.table(
        //     ous.map(ou => ({
        //         name: ou.name,
        //         path: ou.orgUnitPath,
        //         parent: ou.parentOrgUnitPath,
        //         id: ou.orgUnitId
        //     }))
        // )

        do {
            const response = await this.directory.users.list({
                customer: "my_customer",
                maxResults: 100,
                pageToken,
                viewType: "admin_view",
                query: `orgUnitPath='${orgUnitPath}'`,
            });

            for (const user of response.data.users ?? []) {
                accounts.push({
                    id: user.id!,
                    email: user.primaryEmail!,
                    externalIds: user.externalIds?.map(e => e.value!) ?? [],
                    orgPath: user.orgUnitPath ?? undefined,
                    familyName: user.name?.familyName!,
                    givenName: user.name?.givenName!,
                });
            }

            pageToken = response.data.nextPageToken ?? undefined;
        } while (pageToken);

        return accounts;
    }

    async findAccount(key: string): Promise<{id: string, email: string} | null>{ //key can be both id and email perfect for repeated email adresses
        try {
            const response = await this.directory.users.get({
                userKey: key
            })

            return { id: response.data.id!, email: response.data.primaryEmail! };
        } catch (error : any) {
            if (error.code === 404 || error.response?.status === 404) {
                return null; // não existe — não é erro de verdade, é resultado esperado
            }
            throw error; // qualquer outro erro (403, 500, etc.) você quer saber
        }
    }

    async createAccount(input: CreateGoogleAccountInput): Promise<string> {
        const response = await this.directory.users.insert({
            requestBody: {
                primaryEmail: input.email,
                name: {
                    givenName: input.givenName,
                    familyName: input.familyName
                },
                password: randomBytes(8).toString("hex"),
                changePasswordAtNextLogin: true,
                orgUnitPath: input.orgUnitPath ?? "/"
            }
        })
        console.log(response.data)
        return response.data.id!
    }

    async deleteAccount(key: string, uoPath: string): Promise<void> {
        const deleteOrg = this.config.getOrThrow<string>("DELETION_ORG_PATH")

        const deletionPath = `${uoPath}${deleteOrg}`

        await this.directory.users.update({
            userKey: key,
            requestBody: {
                suspended: true,
                orgUnitPath: deletionPath
            }
        })
    }
}