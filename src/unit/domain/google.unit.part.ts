import { Unit } from "./unit.entity";

export const GOOGLE_UNIT_PORT = Symbol("GOOGLE_UNIT_PORT")

export interface GoogleUnitPort{
    create(unit: Unit, origin: "MANUAL" | "SYNC" | "AUTO_MATCH"): Promise<string>
}