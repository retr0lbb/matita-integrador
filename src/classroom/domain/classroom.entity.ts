

export enum ClassroomStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

type CreateClassroomPayload = {
    id: string,
    externalId: string | null,
    unitId: string,
    title: string,
    location: string | null,
    status: ClassroomStatus,
    ownerId: string
}

export class Classroom{
    private constructor(
        private readonly _id: string,
        private _externalId: string | null,
        private readonly _unitId: string,
        private _title: string,
        private _location: string | null,
        private _status: ClassroomStatus,
        private readonly _createdAt: Date,
        private readonly _ownerId: string
    ){}

    static create(payload: CreateClassroomPayload): Classroom{
        return new Classroom(
            payload.id, 
            payload.externalId, 
            payload.unitId, 
            payload.title, 
            payload.location, 
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

    public get location(): string | null{
        return this._location
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

    deactivate(){
        this._status = ClassroomStatus.INACTIVE
    }

    activate(googleExtenalId: string){
        this._status = ClassroomStatus.ACTIVE
        this._externalId = googleExtenalId
    }
}