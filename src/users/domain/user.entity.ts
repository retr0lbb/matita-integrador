import { UserRole } from "./value-objects/user-role";

type ConversionPayload = {
    id: string,
    externalId: string | null,
    firstName: string,
    lastName: string,
    role: UserRole,
    syncMode: SyncMode,
    createdAt: Date,
    updatedAt: Date 
}

type CreatePayload = {
    externalId: string | null,
    firstName: string,
    lastName: string,
    role: UserRole,
    syncMode: SyncMode
}

export enum SyncMode{
    NONE = "NONE",
    ERP = "ERP",
    HYBRID = "HYBRID"
}

export class User {
    private constructor(
        private readonly _id: string,
        private readonly _externalId: string | null,
        private _firstName: string,
        private _lastName: string,
        private readonly _role: UserRole,
        private _syncMode: SyncMode,
        private readonly _createdAt: Date,
        private _updatedAt: Date | null
    ){}

    static create(payload: CreatePayload){
        if (!payload.firstName.trim() || !payload.lastName.trim()) {
            throw new Error('nome e sobrenome não pode ser vazio');
        }

        return new User(
            crypto.randomUUID(), 
            payload.externalId, 
            payload.firstName, 
            payload.lastName, 
            payload.role,
            payload.syncMode,
            new Date(),
            null
        )
    }

    static convertFromDb(payload: ConversionPayload){
        return new User(
            payload.id, 
            payload.externalId, 
            payload.firstName, 
            payload.lastName, 
            payload.role,
            payload.syncMode,
            payload.createdAt,
            payload.updatedAt
        )
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get externalId(): string | null {
        return this._externalId;
    }

    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get role(): UserRole {
        return this._role;
    }

    get syncMode(): SyncMode{
        return this._syncMode
    }

    get createdAt(): Date{
        return this._createdAt
    }

    get updatedAt(): Date | null{
        return this._updatedAt
    }
}