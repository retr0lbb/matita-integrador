import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { unitTable } from "./unitSchema";
import { accountTable } from "./accountSchema";

export const classRoomStatus = pgEnum("classroom_status", [
    "ACTIVE",
    "PENDING",
    "INACTIVE",
]);

export const classRoomTable = pgTable("classrooms", {
    id: uuid().defaultRandom().primaryKey(),
    ownerId: uuid("owner_id").notNull().references(() => accountTable.id, { onDelete: "cascade" }),
    unitId: uuid("unit_id").notNull().references(() => unitTable.id, { onDelete: "cascade" }),
    title: varchar().notNull(),
    status: classRoomStatus().default("PENDING"),
});