import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { institutionTable } from "./institutionSchema";

export const unitTable = pgTable("units", {
    id: uuid().defaultRandom().primaryKey(),
    address: varchar(),
    alias: varchar().unique().notNull(),
    institutionId: uuid("institution_id")
        .notNull()
        .references(() => institutionTable.id),
});