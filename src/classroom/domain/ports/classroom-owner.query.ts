import { UserRole } from "../../../users/domain/value-objects/user-role";

export const CLASSROOM_OWNER_QUERY = Symbol('CLASSROOM_OWNER_QUERY');

export interface ClassroomOwnerQuery {
    findByUserId(userId: string): Promise<ClassroomOwner | null>
}

export type ClassroomOwner = {
    accountId: string;
    userId: string;
    role: UserRole;
    googleExternalId: string | null;
};