
type InstitutionCreatePayload = {
    name: string,
    apiKey: string,
    id: string

}


export class Institution{
    private constructor(
        private readonly _id: string,
        private _name: string,
        private readonly _apiKey: string
    ){}

    static create(payload: InstitutionCreatePayload): Institution {
        return new Institution(
            payload.id,
            payload.name,
            payload.apiKey
        )
    }

    public get id(): string{
        return this._id
    }
    
    public get name() : string {
        return this._name
    }
    
    public get apiKey() : string {
        return this._apiKey
    }

}