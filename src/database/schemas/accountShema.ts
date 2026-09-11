import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./userSchema";

export const accountStatus = pgEnum("account_status", [
  "PENDING",
  "CREATED",
  "BLOCKED",
  "WARNING",
  "DEACTIVATED"
]);

export const accountTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  externalId: uuid("external_id").unique(),
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
