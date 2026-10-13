
type InstitutionCreatePayload = {
    name: string,
    id: string
}

export class Institution{
    private constructor(
        private readonly _id: string,
        private _name: string,
    ){}

    static create(payload: InstitutionCreatePayload): Institution {
        return new Institution(
            payload.id,
            payload.name,
        )
    }

    public get id(): string{
        return this._id
    }
    
    public get name() : string {
        return this._name
    }
}