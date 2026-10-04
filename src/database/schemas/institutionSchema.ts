import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const institutionTable = pgTable("institutions", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar().notNull(),
});