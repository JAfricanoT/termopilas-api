import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

import { actions } from "../actions/schema";
import { devices } from "../devices/schema";
import { identifiers } from "../identifiers/schema";
import { temporary_identifiers } from "../temporary-identifiers/schema";

export const identifier_logs = pgTable("identifier_logs", {
  id: serial().primaryKey().notNull(),
  identifier_id: integer().notNull().references(() => identifiers.id),
  device_id: integer().notNull().references(() => devices.id),
  action_id: integer().notNull().references(() => actions.id),
  timestamp: timestamp().defaultNow(),
});

export const temporary_identifier_logs = pgTable("temporary_identifier_logs", {
  id: serial().primaryKey().notNull(),
  temporary_identifier_id: integer().notNull().references(() => temporary_identifiers.id),
  device_id: integer().notNull().references(() => devices.id),
  action_id: integer().notNull().references(() => actions.id),
  timestamp: timestamp().defaultNow(),
});
