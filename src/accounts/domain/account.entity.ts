import { randomUUID } from "crypto";
import { Email } from "../../shared/domains/value-objects/email.vo";
import { AccountStatus } from "./value-objects/account-status.vo";

type AccountConversionPayload = {
    id: string,
    googleExternalId: string | null,
    userId: string,
    googleEmailAddress: Email,
    createdAt: Date,
    status: AccountStatus
}

type AccountCreatePayload = {
    googleExternalId: string | null,
    userId: string,
    googleEmailAddress: Email
    createdAt: Date,
    status: AccountStatus
}

export class Account {
    private constructor(
        private readonly _id: string,
        private _googleExternalId: string | null,
        private readonly _userId: string,
        private _googleEmailAddress: Email,
        private readonly _createdAt: Date,
        private _status: AccountStatus
    ){}

    static create(payload: AccountCreatePayload){
        const id = randomUUID()
        return new Account(id, null, payload.userId, payload.googleEmailAddress, payload.createdAt, AccountStatus.PENDING)
    }

    static convertFromDb(payload: AccountConversionPayload): Account{
        return new Account(
            payload.id, 
            payload.googleExternalId, 
            payload.userId, 
            payload.googleEmailAddress, 
            payload.createdAt,
            payload.status
        )
    }

    linkToGoogleAccount(googleExternalId: string): void {
        if (this._googleExternalId !== null) {
            throw new Error('conta já está vinculada a uma conta externa do Google');
        }
        this._googleExternalId = googleExternalId;
    }

    isLinkedToGoogle(): boolean {
        return this._googleExternalId !== null;
    }

    public get id():string{
        return this._id
    }
    
    public get googleExternalId() : string | null {
        return this._googleExternalId
    }
    
    public get userId() : string {
        return this._userId
    }

    public get googleEmailAddress() : Email {
        return this._googleEmailAddress
    }

    public get createdAt() : Date{
        return this._createdAt
    }

    public get status(): AccountStatus{
        return this._status
    }

}