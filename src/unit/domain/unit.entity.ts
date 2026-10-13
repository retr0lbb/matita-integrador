
export type CreateUnityPayload = {
    id: string,
    address: string | null,
    alias: string,
    institutionId: string
}

export class Unit{
    private constructor(
        private _id: string,
        private _address: string | null,
        private _alias: string,
        private readonly _institutionId: string
    ){}

    static create(payload: CreateUnityPayload): Unit{
        return new Unit(payload.id, payload.address, payload.alias, payload.institutionId)
    }
    
    public get id() : string {
        return this._id
    }

    
    public get address() : string | null {
        return this._address
    }

    public get alias() : string {
        return this._alias
    }

    public get institutionId(): string{
        return this._institutionId
    }
}