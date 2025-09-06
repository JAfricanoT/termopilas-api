import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

import { devices } from "../devices/schema";
import { keys } from "../keys/schema";
import { role_actions } from "../roles/schema";
import { temporary_keys } from "../temporary-keys/schema";

// ! LOGS
export const key_logs = pgTable("key_logs", {
  id: serial().primaryKey().notNull(),
  key_id: integer().notNull().references(() => keys.id),
  device_id: integer().notNull().references(() => devices.id),
  action_id: integer().notNull().references(() => role_actions.id),
  timestamp: timestamp().defaultNow(),
});

export const temporary_key_logs = pgTable("temporary_key_logs", {
  id: serial().primaryKey().notNull(),
  temporary_key_id: integer().notNull().references(() => temporary_keys.id),
  device_id: integer().notNull().references(() => devices.id),
  action_id: integer().notNull().references(() => role_actions.id),
  timestamp: timestamp().defaultNow(),
});
