import { randomUUID } from "crypto"


export enum ClassroomStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

type CreateClassroomPayload = {
    externalId: string | null,
    googleExternalId: string | null
    unitId: string,
    title: string,
    status: ClassroomStatus,
    ownerId: string
}

type ReconstituteClassroomPayload = {
    id: string,
    externalId: string | null,
    googleExternalId: string | null
    unitId: string,
    title: string,
    status: ClassroomStatus,
    ownerId: string
}
export class Classroom{
    private constructor(
        private readonly _id: string,
        private _externalId: string | null,
        private _googleExternalId: string | null, //Smelly code but for now it will work as intended   
        private readonly _unitId: string,
        private _title: string,
        private _status: ClassroomStatus,
        private readonly _createdAt: Date,
        private readonly _ownerId: string
    ){}

    static create(payload: CreateClassroomPayload): Classroom{
        return new Classroom(
            randomUUID(),
            payload.externalId, 
            payload.googleExternalId,
            payload.unitId, 
            payload.title, 
            payload.status, 
            new Date(),
            payload.ownerId
        )
    }

    static reconstitute(payload: ReconstituteClassroomPayload): Classroom{
        return new Classroom(
            payload.id, 
            payload.externalId, 
            payload.googleExternalId,
            payload.unitId, 
            payload.title, 
            payload.status, 
            new Date(),
            payload.ownerId
        )
    }

    
    public get id() : string {
        return this._id
    }

    public get externalId(): string | null{
        return this._externalId
    }

    public get unitId(): string {
        return this._unitId
    }

    public get title(): string{
        return this._title
    }

    public get status(): ClassroomStatus{
        return this._status
    }

    public get createdAt(): Date{
        return this._createdAt
    }

    public get ownerId(): string{
        return this._ownerId
    }
    public get googleExternalId(): string | null{
        return this._googleExternalId
    }

    deactivate(){
        this._status = ClassroomStatus.INACTIVE
    }

    activate(googleExtenalId: string){
        this._status = ClassroomStatus.ACTIVE
        this._googleExternalId = googleExtenalId
    }
}