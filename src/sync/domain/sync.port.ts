//url https://api.lex.education/sync/v1/tenants

export type TenantSnapshot = {
    syncId: string,
    syncDateTime: Date,
    data: {
        id: string,
        tenantName: string
    }[]
}


//url https://api.lex.education/sync/v1/full?tenantId=[UUID do inquilino]
// domain/sync/institution-snapshot.ts
export type SnapshotRole = 'STUDENT' | 'TEACHER';

export interface InstitutionSnapshot {
  source: 'LEX' | 'CSV' | 'FAKE';
  syncId: string;
  syncedAt: Date;
  institution: { externalId: string; name: string };
  units: SnapshotUnit[];
  users: SnapshotUser[];
  classes: SnapshotClass[];
}

export interface SnapshotUnit {
  externalId: string;
  name: string;
}

export interface SnapshotUser {
  externalId: string;
  name: string;
  email: string | null;
}

export interface SnapshotMember {
  userExternalId: string;
  role: SnapshotRole;
}

export interface SnapshotClass {
  externalId: string;
  unitExternalId: string;
  name: string;
  schoolYear: number;
  grade: string | null;
  members: SnapshotMember[];
}

export const SNAPSHOT_SOURCE_PORT = Symbol('SNAPSHOT_SOURCE_PORT');

export interface SnapshotSourcePort{
    listInstitutions(): Promise<TenantSnapshot>
    fetchSnapshot(tenantId: string): Promise<InstitutionSnapshot> 
}