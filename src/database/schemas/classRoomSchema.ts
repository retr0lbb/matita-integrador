import { pgEnum, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { unitTable } from "./unitSchema";
import { varchar } from "drizzle-orm/cockroach-core";
import { accountTable } from "./accountSchema"

export const classRoomStatus = pgEnum("classroom_status", [
    "ACTIVE",
    "PENDING",
    "INACTIVE"
]);

export const classRoomTable = pgTable("classrooms", {
    id: uuid().defaultRandom().primaryKey(),
    googleClassroomId: varchar("google_classroom_id").unique(),
    externalId: varchar("external_id"),
    ownerId: uuid("owner_id").notNull().references(() => accountTable.id),
    unitId: uuid("unit_id").notNull().references(() => unitTable.id),
    title: varchar().notNull().unique(),
    status: classRoomStatus().default("PENDING")
}, (table) => [
    unique("classroom_google_id_external_id").on(table.googleClassroomId, table.externalId)
])