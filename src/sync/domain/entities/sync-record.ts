

//adicionar um enum para o tipo de sync, tipo update, migration, delete, creation
export type CreateSyncRecord = {
    externalId: string | null
    provider: "LEX" | "GOOGLE" | null
    hasHash: boolean
    syncHash?: undefined | string
}

export class SyncRecord {
    protected externalId: string | null = null
    protected provider: "LEX" | "GOOGLE" | null = null
    protected hasHash: boolean = false
    protected syncHash?: undefined | string
    protected createdAt: Date | null = null
    protected syncedAt: Date | null = null

    constructor(data: CreateSyncRecord){
        this.externalId = data.externalId
        this.provider = data.provider
        this.hasHash = data.hasHash
        this.syncHash = data.syncHash
        this.createdAt = new Date()
    }

    setSyncedAt(date: Date){
        this.syncedAt = date
    }

    getExternalId(){
        return this.externalId
    }

    getProvider(){
        return this.provider
    }

    getHash(): string | null{
        if(!this.hasHash) return null
        return this.syncHash ?? null
    }
}