import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE } from "../../../database/providers/drizzle.provider";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { AccountRepository } from "../../domain/account.repository";
import { Account, ExternalProvider } from "../../domain/account.entity";
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
            email: account.email? account.email.getValue(): null,
            externalId: account.externalId,
            status: account.status,
            userId: account.userId,
            provider: account.provider as any
        }).onConflictDoUpdate({
            target: accountTable.id,
            set: {
                email: account.email? account.email.getValue(): null,
                externalId: account.externalId,
                status: account.status,
                userId: account.userId
            }
        })
    }

    async updateGoogleIdForAccount(account: Account): Promise<void> {
        if(account.status!== AccountStatus.ACTIVE){
            throw new Error("Account not active")
        }

        if(!account.externalId){
            throw new Error("Cannot activate a id Less account")
        }
        
        await this.db.update(accountTable).set({
            externalId: account.externalId,
            status: "ACTIVE"
        }).where(eq(accountTable.id, account.id))
    }

    async setFailedPending(account: Account): Promise<void> {
        await this.db.update(accountTable).set({
            status: "FAILED"
        }).where(eq(accountTable.id, account.id))
    }

    async findById(id: string): Promise<Account | null> {
        const [account] = await this.db.select().from(accountTable).where(eq(accountTable.id, id))

        if(!account){
            return null
        }
        const accountObject = Account.reconstitute({
            id: account.id,
            createdAt: account.createdAt, 
            email: account.email? Email.create(account.email): null,
            status: account.status as AccountStatus,
            userId: account.userId,
            externalId: account.externalId,
            hash: account.syncHash,
            provider: account.provider as ExternalProvider,
            updatedAt: account.updatedAt
        })

        return accountObject
    }

    async findByEmail(email: string): Promise<Account | null> {
        const [account] = await this.db.select().from(accountTable).where(eq(accountTable.email, email))

        if(!account){
            return null
        }

        const accountObject = Account.reconstitute({
            id: account.id,
            createdAt: account.createdAt, 
            email: account.email? Email.create(account.email): null,
            status: account.status as AccountStatus,
            userId: account.userId,
            externalId: account.externalId,
            hash: account.syncHash,
            provider: account.provider as ExternalProvider,
            updatedAt: account.updatedAt
        })

        return accountObject
    }

    async findByProviderExternalId(id: string): Promise<Account | null> {
        const [account] = await this.db.select().from(accountTable).where(eq(accountTable.externalId, id))

        if(!account){
            return null
        }

        const accountObject = Account.reconstitute({
            id: account.id,
            createdAt: account.createdAt, 
            email: account.email? Email.create(account.email): null,
            status: account.status as AccountStatus,
            userId: account.userId,
            externalId: account.externalId,
            hash: account.syncHash,
            provider: account.provider as ExternalProvider,
            updatedAt: account.updatedAt
        })

        return accountObject
    }

    async delete(accountId: string): Promise<void> {
        await this.db.delete(accountTable).where(eq(accountTable.id, accountId))
    }

    async listAccount(): Promise<Account[]> {
        const accounts = await this.db.select().from(accountTable)

        const mappedAccounts = accounts.map((account) => {
            return Account.reconstitute({
                id: account.id,
                createdAt: account.createdAt, 
                email: account.email? Email.create(account.email): null,
                status: account.status as AccountStatus,
                userId: account.userId,
                externalId: account.externalId,
                hash: account.syncHash,
                provider: account.provider as ExternalProvider,
                updatedAt: account.updatedAt
            })
        })

        return mappedAccounts
    }
}