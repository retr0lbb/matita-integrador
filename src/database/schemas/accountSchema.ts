import { pgEnum, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./userSchema";

export const accountStatus = pgEnum("account_status", [
  "PENDING",
  "ACTIVE",
  "FAILED"
]);

export const providerEnum = pgEnum('external_provider', ['LEX', 'GOOGLE']);

export const accountTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  provider: providerEnum("provider").notNull(),
  externalId: varchar("external_id").unique(),
  syncHash: varchar('sync_hash', { length: 255 }),
  email: varchar().unique(),
  status: accountStatus().notNull().default("PENDING"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdateFn(() => new Date()),
}, (table) => ([
    unique("unique_user_provider").on(table.userId, table.provider) 
]));
