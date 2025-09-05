import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { device_roles } from "../roles/schema";
import { users } from "../users/schema";

// ! DEVICE
export const devices = pgTable("devices", {
  id: serial().primaryKey().notNull(),
  device_id: text().notNull().unique(),
  token: text().notNull().unique(),
  role_id: integer().default(1).notNull().references(() => device_roles.id),
  created_at: timestamp().defaultNow(),
});

export const device_status = pgTable("device_status", {
  id: serial().primaryKey().notNull(),
  device_id: integer().notNull().references(() => devices.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});
