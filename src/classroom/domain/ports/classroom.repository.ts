import { User } from "../../../users/domain/user.entity";
import { Classroom } from "../classroom.entity";

export const CLASSROOM_REPOSITORY = Symbol('CLASSROOM_REPOSITORY');

export interface ClassRoomRepository{
    save(classroom: Classroom): Promise<void>
    findClassroomById(id: string): Promise<Classroom | null>
    findByProviderExternalId(externalId: string, provider: "LEX" | "GOOGLE"): Promise<Classroom | null>
    listClassrooms(): Promise<Classroom[]>
}