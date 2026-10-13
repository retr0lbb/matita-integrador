import { User } from "../../../users/domain/user.entity";
import { Classroom } from "../classroom.entity";

export const USER_CLASSROOM_REPOSITORY = Symbol('USER_CLASSROOM_REPOSITORY');

export type UserClassroomRelation = {
    id: string,
    userId: string,
    classRoomId: string
}

export interface UserClassRepository{
    getUserToClassroom(userId: string, classroomId: string): Promise<UserClassroomRelation | null>
    getClassStudents(classroom: Classroom): Promise<User[]>
    saveUserToClassroom(userId: string, classroomId: string): Promise<void>
    removeUserFromClassroom(userId: string, classroomId: string): Promise<void>
}
