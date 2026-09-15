import { pgTable, uuid, varchar, pgEnum, timestamp } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ALUNO', 'PROFESSOR', 'ADMIN']);
export const userSyncModeEnum = pgEnum('user_sync_mode', [
  'NONE',
  'ERP',
  'HYBRID',
]);

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdateFn(() => new Date()),
});