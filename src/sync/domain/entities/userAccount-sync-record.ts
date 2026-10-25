import { SyncRecord } from "./sync-record"


export type UserAccountSyncRecordType ={
    externalId: string | null
    hasHash: boolean
    provider: "LEX" | "GOOGLE" | null
    syncHash?: string | undefined
    firstName: string
    lastName?: string
    middleName?: string
    emailAccount?: string
    metadata?: unknown
}

export class UserAccountSyncRecord extends SyncRecord{
    protected firstName: string
    protected lastName?: string
    protected middleName?: string
    protected emailAccount?: string
    protected metadata?: unknown

    constructor(data: UserAccountSyncRecordType){
        super({...data})

        this.emailAccount = data.emailAccount
        this.firstName = data.firstName
        this.lastName = data.lastName
        if(data.metadata){
            this.metadata = data.metadata
        }
    }

    setSyncedAt(date: Date): void {
        this.syncedAt = date   
    }

    compareMail(other: UserAccountSyncRecord): boolean{ //this can be more complex later, if the student dont have an email with it
        if(this.emailAccount === other.emailAccount){
            return true
        }
        return false
    }

    compareNameStrict(other: UserAccountSyncRecord): boolean{
        const mineName = 
            `${this.firstName}${this.middleName ?? ""}${this.lastName ?? ""}`
            .toLowerCase()
            .replace(" ", "") //depois add algo para mudar os acentos tlg.
        const otherName = 
            `${other.firstName}${other.middleName ?? ""}${other.lastName ?? ""}`
            .toLowerCase()
            .replace(" ", "") //depois add algo para mudar os acentos tlg.

        return mineName === otherName
    }

    hasChanged(other: UserAccountSyncRecord){
        if(this.getHash() && other.getHash()){
            return this.syncHash !== other.syncHash
        }

        if(this.compareMail(other)){
            return false
        }

        if(this.compareNameStrict(other)){
            return false
        }

        return true
    }
}