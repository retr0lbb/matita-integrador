import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { usersTable } from "./userSchema";
import { classRoomTable } from "./classRoomSchema";

export const classRoomUsersTable = pgTable("classroom_users", {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    classRoomId: uuid("classroom_id").notNull().references(() => classRoomTable.id)
})