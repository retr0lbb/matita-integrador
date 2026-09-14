import { Injectable } from "@nestjs/common";
import { CreateGoogleAccountInput, GoogleAccountProviderClient } from "../domain/google-account-provider";
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
            scopes: ['https://www.googleapis.com/auth/admin.directory.user'],
            subject: config.get<string>("GOOGLE_CLIENT_EMAIL"),
        });

        this.directory = google.admin({version: "directory_v1", auth})
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

    async findAccountById(accountId: string): Promise<any> {
        const account = this.directory.users.get()
    }

}