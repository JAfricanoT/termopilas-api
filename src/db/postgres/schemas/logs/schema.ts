import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z, { boolean } from "zod";
import { actions } from "../actions/schema";
import { devices } from "../devices/schema";
import { identifiers } from "../identifiers/schema";
import { temporary_identifier_bearers } from "../identifiers/temporary/schema";

export const identifier_logs = pgTable("identifier_logs", {
  id: serial().primaryKey().notNull(),
  identifier_id: integer().notNull().references(() => identifiers.id),
  device_id: integer().notNull().references(() => devices.id),
  action_id: integer().notNull().references(() => actions.id),
  created_at: timestamp().defaultNow(),
});

export const temporary_identifier_logs = pgTable("temporary_identifier_logs", {
  id: serial().primaryKey().notNull(),
  temporary_identifier_bearer_id: integer().notNull().references(() => temporary_identifier_bearers.id),
  device_id: integer().notNull().references(() => devices.id),
  action_id: integer().notNull().references(() => actions.id),
  created_at: timestamp().defaultNow(),
});

export const selectIdentifierLogsSchema = toZodV4SchemaTyped(createSelectSchema(identifier_logs));
export const insertIdentifierLogSchema = toZodV4SchemaTyped(createInsertSchema(identifier_logs)
  .required({
    identifier_id: true,
    device_id: true,
    action_id: true,
  }).omit({
    id: true,
    created_at: true,
  }));

  export const selectTemporaryIdentifierLogsSchema = toZodV4SchemaTyped(createSelectSchema(temporary_identifier_logs));
export const insertTemporaryIdentifierLogSchema = toZodV4SchemaTyped(createInsertSchema(temporary_identifier_logs)
  .required({
    temporary_identifier_id: true,
    device_id: true,
    action_id: true,
  }).omit({
    id: true,
    created_at: true,
  }));

  export const responsesIdentifierLogsSchema = z.object({
    action: selectIdentifierLogsSchema,
    isEntry: boolean(),
  });
  export const responsesTemporaryIdentifierLogsSchema = z.object({
    action: selectTemporaryIdentifierLogsSchema,
    isEntry: boolean(),
  });