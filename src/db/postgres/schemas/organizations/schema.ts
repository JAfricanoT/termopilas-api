import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/schema";

// ! ORGANIZATIONS
export const organizations = pgTable("organizations", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const organization_status = pgTable("organization_status", {
  id: serial().primaryKey().notNull(),
  organization_id: integer().notNull().references(() => organizations.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});
