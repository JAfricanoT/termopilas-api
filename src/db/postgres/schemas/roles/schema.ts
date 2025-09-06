import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "../users/schema";

export const user_roles = pgTable("user_roles", {
  id: serial().primaryKey().notNull(),
  name: text().notNull().unique(),
  description: text(),
  created_at: timestamp().defaultNow(),
});

export const user_role_status = pgTable("user_role_status", {
  id: serial().primaryKey().notNull(),
  user_role_id: integer().notNull().references(() => user_roles.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const device_roles = pgTable("device_roles", {
  id: serial().primaryKey().notNull(),
  name: text().notNull().unique(),
  description: text(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const device_role_status = pgTable("device_role_status", {
  id: serial().primaryKey().notNull(),
  device_role_id: integer().notNull().references(() => device_roles.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});
