import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/domains/use-case.interface";
import { SNAPSHOT_SOURCE_PORT, type SnapshotSourcePort } from "../sync.port";
import { UserAccountSyncRecord } from "../entities/userAccount-sync-record";
import { ACCOUNT_REPOSITORY, type AccountRepository } from "../../../accounts/domain/account.repository";
import { UNIT_REPOSITORY, type UnitRepository } from "../../../unit/domain/unity.repository";
import { generateDiffReport } from "../diff-sync";
import { User } from "../../../users/domain/user.entity";

@Injectable()
export class SyncLexToLex implements UseCase{
    constructor(
        @Inject(SNAPSHOT_SOURCE_PORT) private readonly lexSnapshotPort: SnapshotSourcePort,
        @Inject(ACCOUNT_REPOSITORY) private readonly accountRepo: AccountRepository, //devo usar o user repository ou o account repository?
        @Inject(UNIT_REPOSITORY) private readonly unitRepo: UnitRepository
    ){}
    
    async execute(tenantId: string) {
        const metadata = await this.lexSnapshotPort.listInstitutions()

        const found = metadata.data.some(t => t.id === tenantId)

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

        const currentUserAccounts = await this.accountRepo.findManyByExternalProviderAndUnit("LEX", unitRelatedToTenant.id)
        const localLexUserSyncState: UserAccountSyncRecord[] = []
        const unlinkedUsers: User[] = []

        for (const { account, user } of currentUserAccounts) {
            // sem usuário não há o que comparar (não deveria acontecer, mas o tipo permite)
            if (!user) continue

            // está na unidade, mas não tem conta LEX vinculada
            if (!account || account.externalId === null) {
                unlinkedUsers.push(user)
                continue
            }

            localLexUserSyncState.push(new UserAccountSyncRecord({
                externalId: account.externalId,
                emailAccount: account.email?.getValue(),
                hasHash: account.syncHash !== null,
                syncHash: account.syncHash ?? undefined,
                provider: account.provider as "LEX" | "GOOGLE",
                firstName: user.consolidateName(),
            }))
        }

        console.log(generateDiffReport(lexUsersSyncState, localLexUserSyncState)) //nao eh para parar aqui. 
        // esse ja seria o retorno mas ai teria que injetar no cron
    }
}