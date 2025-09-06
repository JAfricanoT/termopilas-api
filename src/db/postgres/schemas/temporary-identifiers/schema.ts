import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { organizations } from "../organizations/schema";
import { users } from "../users/schema";

export const temporary_identifiers = pgTable("temporary_identifiers", {
  id: serial().primaryKey().notNull(),
  temp_identifier_id: text().notNull().unique(),
  factory_id: text().notNull().unique(),
  created_at: timestamp().defaultNow(),
});

export const temporary_identifier_bearers = pgTable("temporary_identifier_bearers", {
  id: serial().primaryKey().notNull(),
  identifier_id: integer().notNull().references(() => temporary_identifiers.id),
  user_id: integer().notNull().references(() => users.id),
  organization_id: integer().notNull().references(() => organizations.id),
  valid_from: timestamp().defaultNow(),
  valid_to: timestamp().notNull(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const temporary_identifier_bearer_status = pgTable("temporary_identifier_bearer_status", {
  id: serial().primaryKey().notNull(),
  temporary_identifier_bearer_id: integer().notNull().references(() => temporary_identifier_bearers.id),
  user_id: integer().notNull().references(() => users.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});
