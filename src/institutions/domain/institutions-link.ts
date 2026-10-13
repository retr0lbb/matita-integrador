import { Institution } from "./institution.entity"

export const INSTITUTION_LINK = Symbol('INSTITUTION_LINK');

export type ConnectInstitution = {
    creds: string,
    institutionId: string,
    externalId: string,
    externalPath?: string,
    metadata?: Record<string, unknown>,
    syncHash?: string | null,
    origin: "SYNC"| "MANUAL" | "AUTO_MATCH",
    lastSyncedAt: Date,
}

export interface InstitutionLinkPort{
    connectInstitution(data: ConnectInstitution): Promise<void>
}