import { Classroom } from "../../classroom/domain/classroom.entity";
import { Unit } from "./unit.entity";

export const UNIT_REPOSITORY = Symbol('UNIT_REPOSITORY');

export interface UnitRepository{
    save(unit: Unit): Promise<void>
    findById(id: string): Promise<Unit | null>
    listUnity(): Promise<Unit[]>

    listUnitClassrooms(unitId: string): Promise<Classroom[]>
}