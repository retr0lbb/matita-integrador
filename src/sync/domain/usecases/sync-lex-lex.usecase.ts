import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/domains/use-case.interface";
import { SNAPSHOT_SOURCE_PORT, type SnapshotSourcePort } from "../sync.port";
import { UserAccountSyncRecord } from "../entities/userAccount-sync-record";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../../../accounts/domain/account.repository";
import { UNIT_REPOSITORY, type UnitRepository } from "../../../unit/domain/unity.repository";
import { generateDiffReport } from "../diff-sync";

@Injectable()
export class SyncLexToLex implements UseCase{
    constructor(
        @Inject(SNAPSHOT_SOURCE_PORT) private readonly lexSnapshotPort: SnapshotSourcePort,
        @Inject(ACCOUNT_REPOSITORY) private readonly accountRepo: AccountRepository, //devo usar o user repository ou o account repository?
        @Inject(UNIT_REPOSITORY) private readonly unitRepo: UnitRepository
    ){}
    
    async execute(tenantId: string) {
        const metadata = await this.lexSnapshotPort.listInstitutions()

        const found = tenantId in metadata.data

        if(!found){
            throw new Error("Tenant Doesnot exists")
        }

        const unitRelatedToTenant = await this.unitRepo.findByExternalIdAndProvider(tenantId, "LEX")

        if(!unitRelatedToTenant){
            throw new Error("Unit needs to be created before")
        }

        const { users } = await this.lexSnapshotPort.fetchSnapshot(tenantId) //vamos pegar os users

        const lexUsersSyncState = users.map(user => new UserAccountSyncRecord({
            emailAccount: user.email ?? undefined,
            provider: "LEX",
            firstName: user.name,
            externalId: user.externalId,
            hasHash: false,
            lastName: undefined
        }))

        const currentUserAccount = await this.accountRepo.findManyByExternalProviderAndUnit("LEX", unitRelatedToTenant.id)

        const localLexUserSyncState = currentUserAccount.map((user) => new UserAccountSyncRecord({
            externalId: user.account.externalId,
            emailAccount: user.account.email ? user.account.email.getValue(): undefined,
            hasHash: user.account.syncHash !== null,
            syncHash: user.account.syncHash !== null? user.account.syncHash: undefined,
            provider: user.account.provider as "LEX" | "GOOGLE",
            firstName: user.user.consolidateName()
        }))

        console.log(generateDiffReport(lexUsersSyncState, localLexUserSyncState)) //nao eh para parar aqui. 
        // esse ja seria o retorno mas ai teria que injetar no cron
    }
}