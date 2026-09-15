import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { unitTable } from "./unitSchema";
import { varchar } from "drizzle-orm/cockroach-core";
import { usersTable } from "./userSchema";


export const classRoomStatus = pgEnum("classroom_status", [
    "ACTIVE",
    "PENDING",
    "INACTIVE"
]);

export const classRoomTable = pgTable("classrooms", {
    id: uuid().defaultRandom().primaryKey(),
    externalId: varchar("external_id").unique(),
    ownerId: uuid("owner_id").notNull().references(() => usersTable.id),
    unitId: uuid("unit_id").notNull().references(() => unitTable.id),
    title: varchar().notNull(),
    location: varchar(),
    status: classRoomStatus().default("PENDING")
})