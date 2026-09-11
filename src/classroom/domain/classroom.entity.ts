
export enum ClassRoomShift{
    MORNING = "MORNING",
    NIGHT = "NIGHT",
    FULLTIME = "FULLTIME",
    OTHER = "OTHER"
}

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
    shift: ClassRoomShift,
    status: ClassroomStatus,
}

export class Classroom{
    private constructor(
        private readonly _id: string,
        private readonly _externalId: string | null,
        private readonly _unitId: string,
        private _title: string,
        private _location: string | null,
        private _shift: ClassRoomShift,
        private _status: ClassroomStatus,
        private readonly _createdAt: Date,
    ){}

    static create(payload: CreateClassroomPayload): Classroom{
        return new Classroom(
            payload.id, 
            payload.externalId, 
            payload.unitId, 
            payload.title, 
            payload.location, 
            payload.shift, 
            payload.status, 
            new Date()
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

    public get shift(): ClassRoomShift{
        return this._shift
    }

    public get status(): ClassroomStatus{
        return this._status
    }

    public get createdAt(): Date{
        return this._createdAt
    }
}