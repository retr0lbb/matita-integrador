import { User } from "../../users/domain/user.entity";
import { Classroom } from "./classroom.entity";

export const CLASSROOM_REPOSITORY = Symbol('CLASSROOM_REPOSITORY');

export interface ClassRoomRepository{
    save(classroom: Classroom): Promise<void>
    findById(id: string): Promise<Classroom | null>
    findByProviderExternalId(id: string): Promise<Classroom | null>
    listClassrooms(): Promise<Classroom[]>
}