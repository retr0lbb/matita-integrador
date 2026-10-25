import { pgEnum, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./userSchema";
import { unitTable } from "./unitSchema";

export const userUnitTable = pgTable("users_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => unitTable.id, {onDelete: "cascade"}),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdateFn(() => new Date()),
}, (table) => ([
    unique("unique_user_on_unit").on(table.userId, table.unitId) 
]));
