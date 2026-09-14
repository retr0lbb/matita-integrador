import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./userSchema";

export const accountStatus = pgEnum("account_status", [
  "PENDING",
  "ACTIVE",
  "FAILED"
]);

export const accountTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  externalId: varchar("external_id").unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  email: varchar().unique().notNull(),
  status: accountStatus().notNull().default("PENDING"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
