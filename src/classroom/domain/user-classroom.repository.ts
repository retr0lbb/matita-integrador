

export const USER_CLASSROOM_REPOSITORY = Symbol('USER_CLASSROOM_REPOSITORY');

export interface UserClassRepository{
    addUserToClassRoom(userId: string, classroomId: string): Promise<void>,
    removeUserFromClassroom(userId: string, classroomId: string): Promise<void>
}
