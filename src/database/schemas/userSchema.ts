import { pgTable, uuid, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ALUNO', 'PROFESSOR', 'ADMIN']);

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey(),
  externalId: uuid("external_id").unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: userRoleEnum('role').notNull(),
});