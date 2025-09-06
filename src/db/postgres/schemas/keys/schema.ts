import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { organizations } from "../organizations/schema";
import { users } from "../users/schema";

// ! KEYS
export const keys = pgTable("keys", {
  id: serial().primaryKey().notNull(),
  key_id: text().notNull().unique(),
  factory_id: text().notNull().unique(),
  user_id: integer().notNull().references(() => users.id),
  organization_id: integer().notNull().references(() => organizations.id),
  created_at: timestamp().defaultNow(),
});

export const key_status = pgTable("key_status", {
  id: serial().primaryKey().notNull(),
  key_id: integer().notNull().references(() => keys.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});
