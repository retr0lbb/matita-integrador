import { varchar } from "drizzle-orm/cockroach-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { institutionTable } from "./institutionSchema";


export const unitTable = pgTable("units",{
    id: uuid().defaultRandom().primaryKey().notNull(),
    externalId: uuid("external_id").notNull().unique(),
    address: varchar(),
    alias: varchar().unique().notNull(),
    institutionId: uuid().references(() => institutionTable.id).notNull()
})