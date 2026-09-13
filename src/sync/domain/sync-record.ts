import { Account } from "../../accounts/domain/account.entity";
import { Classroom } from "../../classroom/domain/classroom.entity";
import { User } from "../../users/domain/user.entity";

// domain/sync/sync-record.ts
export type SyncRecord = {
  lexExternalId: string | null;
  firstName: string,
  lastName: string;
  email: string;
  turmaExternalId: string | null;
  role: 'ALUNO' | 'PROFESSOR';
  syncHash?: string;
};

export function toSyncRecord(user: User, classRoom: Classroom, account: Account ): SyncRecord{
    return {
        email: account.googleEmailAddress.getValue(),
        lexExternalId: user.externalId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as "ALUNO" | "PROFESSOR",
        turmaExternalId: classRoom.externalId,
        syncHash: user.hash ?? undefined
    }
}