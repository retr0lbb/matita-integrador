import { UserRole } from "./value-objects/user-role";

// domain/user/infer-role-from-org-unit.ts
export function inferRoleFromOrgUnit(orgUnitPath: string): UserRole {
  const normalized = orgUnitPath.toLowerCase();
  if (normalized.includes('professores')) return UserRole.PROFESSOR;
  if (normalized.includes('alunos')) return UserRole.ALUNO;
  return UserRole.ALUNO;
}