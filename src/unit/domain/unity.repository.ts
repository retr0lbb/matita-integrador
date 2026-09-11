import { Unit } from "./unit.entity";

export const UNIT_REPOSITORY = Symbol('UNIT_REPOSITORY');

export interface UnitRepository{
    save(account: Unit): Promise<void>
    findById(id: string): Promise<Unit | null>
    findByExternalId(externalId: string): Promise<Unit | null>
    listUnity(): Promise<Unit[]>
}