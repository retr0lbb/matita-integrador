import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { unitTable } from "./unitSchema";
import { varchar } from "drizzle-orm/cockroach-core";

export const classRoomShifts = pgEnum("classroom_shift", [
    "MORNING",
    "NIGHT",
    "FULLTIME",
    "OTHER"
]);

export const classRoomStatus = pgEnum("classroom_status", [
    "ACTIVE",
    "INACTIVE",
]);

export const classRoomTable = pgTable("classrooms", {
    id: uuid().defaultRandom().primaryKey(),
    externalId: varchar("external_id").unique(),
    unitId: uuid("unit_id").notNull().references(() => unitTable.id),
    title: varchar().notNull(),
    location: varchar(),
    shift: classRoomShifts().default("MORNING"),
    status: classRoomStatus().default("ACTIVE")
})