import { privateDecrypt, randomUUID } from "crypto"


export enum ClassroomStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    INACTIVE = "INACTIVE",
}

type CreateClassroomPayload = {
    lexId?: string,
    googleId?: string
    unitId: string,
    title: string,
    status: ClassroomStatus,
    ownerId: string
}

type ReconstituteClassroomPayload = {
    id: string,
    lexId: string | null,
    googleId: string | null
    unitId: string,
    title: string,
    status: ClassroomStatus,
    ownerId: string
}
export class Classroom{
    private constructor(
        private readonly _id: string,
        private _lexId: string | null,
        private _googleId: string | null,
        private readonly _unitId: string,
        private _title: string,
        private _status: ClassroomStatus,
        private readonly _createdAt: Date,
        private readonly _ownerId: string
    ){}

    static create(payload: CreateClassroomPayload): Classroom{
        return new Classroom(
            randomUUID(),
            payload.lexId ?? null,
            payload.googleId ?? null,
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
            payload.lexId, 
            payload.googleId,
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

    public get lexId(): string | null{
        return this._lexId
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
    public get googleId(): string | null{
        return this._googleId
    }

    public deactivate(){
        this._status = ClassroomStatus.INACTIVE
    }

    public activate(googleId: string){
        this._googleId = googleId
        this._status = ClassroomStatus.ACTIVE
    }
}