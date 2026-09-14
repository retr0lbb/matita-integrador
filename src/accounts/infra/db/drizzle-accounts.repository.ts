import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE } from "../../../database/providers/drizzle.provider";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { AccountRepository } from "../../domain/account.repository";
import { Account } from "../../domain/account.entity";
import { accountTable } from "../../../database/schemas/accountSchema";
import { eq } from "drizzle-orm";
import { Email } from "../../../shared/domains/value-objects/email.vo";
import { AccountStatus } from "../../domain/value-objects/account-status.vo";


@Injectable()
export class DrizzleAccountRepository implements AccountRepository{
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase,
    ){}

    async save(account: Account): Promise<void> {
        await this.db.insert(accountTable).values({
            id: account.id,
            email: account.googleEmailAddress.getValue(),
            externalId: account.googleExternalId,
            status: account.status,
            userId: account.userId,
        })
    }

    async findById(id: string): Promise<Account | null> {
        const [account] = await this.db.select().from(accountTable).where(eq(accountTable.id, id))

        if(!account){
            return null
        }

        const accountObject = Account.convertFromDb({
            id: account.id,
            createdAt: account.createdAt, 
            googleEmailAddress: Email.create(account.email),
            status: account.status as AccountStatus,
            userId: account.userId,
            googleExternalId: account.externalId
        })

        return accountObject
    }

    async findByEmail(email: string): Promise<Account | null> {
        const [account] = await this.db.select().from(accountTable).where(eq(accountTable.email, email))

        if(!account){
            return null
        }

        const accountObject = Account.convertFromDb({
            id: account.id,
            createdAt: account.createdAt, 
            googleEmailAddress: Email.create(account.email),
            status: account.status as AccountStatus,
            userId: account.userId,
            googleExternalId: account.externalId
        })

        return accountObject
    }

    async findByProviderExternalId(id: string): Promise<Account | null> {
        const [account] = await this.db.select().from(accountTable).where(eq(accountTable.externalId, id))

        if(!account){
            return null
        }

        const accountObject = Account.convertFromDb({
            id: account.id,
            createdAt: account.createdAt, 
            googleEmailAddress: Email.create(account.email),
            status: account.status as AccountStatus,
            userId: account.userId,
            googleExternalId: account.externalId
        })

        return accountObject
    }

    async listAccount(): Promise<Account[]> {
        const accounts = await this.db.select().from(accountTable)

        const mappedAccounts = accounts.map((account) => {
            return Account.convertFromDb({
                id: account.id,
                createdAt: account.createdAt, 
                googleEmailAddress: Email.create(account.email),
                status: account.status as AccountStatus,
                userId: account.userId,
                googleExternalId: account.externalId
            })
        })

        return mappedAccounts
    }
}