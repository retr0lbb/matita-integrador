import { randomUUID } from "crypto";


type InstitutionCreatePayload = {
    name: string,
    apiKey: string
}

type InstitutionConversionPayload = {
    id: string
    name: string
    apiKey: string
}

export class Institution{
    private constructor(
        private readonly _id: string,
        private _name: string,
        private readonly _apiKey: string
    ){}

    static create(payload: InstitutionCreatePayload): Institution {
        const id = randomUUID();
        return new Institution(
            id,
            payload.name,
            payload.apiKey
        )
    }
    
    static convertFromDb(payload: InstitutionConversionPayload): Institution {
        return new Institution(
            payload.id,
            payload.name,
            payload.apiKey
        )
    }
}