import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: serial().primaryKey().notNull(),
  lida_id: text().notNull().unique(),
  role_id: integer().default(1).notNull(),
  created_at: timestamp().defaultNow(),
});

export const user_status = pgTable("user_status", {
  id: serial().primaryKey().notNull(),
  user_id: integer().notNull().references(() => users.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull(),
  created_at: timestamp().defaultNow(),
});