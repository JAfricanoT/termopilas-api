import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { device_roles, user_roles } from "../roles/user/schema";
import { users } from "../users/schema";

export const actions = pgTable("actions", {
  id: serial().primaryKey().notNull(),
  name: text().notNull().unique(),
  description: text(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const action_status = pgTable("action_status", {
  id: serial().primaryKey().notNull(),
  action_id: integer().notNull().references(() => actions.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const action_roles = pgTable("action_roles", {
  id: serial().primaryKey().notNull(),
  action_id: integer().notNull().references(() => actions.id),
  device_role_id: integer().notNull().references(() => device_roles.id),
  user_role_id: integer().notNull().references(() => user_roles.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});
