import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { devices } from "../devices/schema";
import { identifiers } from "../identifiers/schema";
import { temporary_identifier_bearers } from "../identifiers/temporary/schema";
import { users } from "../users/schema";

export const errors = pgTable("errors", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const identifier_errors = pgTable("identifier_errors", {
  id: serial().primaryKey().notNull(),
  identifier_id: integer().notNull().references(() => identifiers.id),
  device_id: integer().notNull().references(() => devices.id),
  error_id: integer().notNull().references(() => errors.id),
  created_at: timestamp().defaultNow(),
});

export const temporary_identifier_errors = pgTable("temporary_identifier_errors", {
  id: serial().primaryKey().notNull(),
  temporary_identifier_bearer_id: integer().notNull().references(() => temporary_identifier_bearers.id),
  device_id: integer().notNull().references(() => devices.id),
  error_id: integer().notNull().references(() => errors.id),
  created_at: timestamp().defaultNow(),
});

export const selectIdentifierErrorsSchema = toZodV4SchemaTyped(createSelectSchema(identifier_errors));
export const insertIdentifierLogSchema = toZodV4SchemaTyped(createInsertSchema(identifier_errors)
  .required({
    identifier_id: true,
    device_id: true,
    error_id: true,
  }).omit({
    id: true,
    error_id: true,
  }));

  export const selectTemporaryIdentifierErrorsSchema = toZodV4SchemaTyped(createSelectSchema(temporary_identifier_errors));
export const insertTemporaryIdentifierErrorSchema = toZodV4SchemaTyped(createInsertSchema(temporary_identifier_errors)
  .required({
    temporary_identifier_id: true,
    device_id: true,
    error_id: true,
  }).omit({
    id: true,
    created_at: true,
  }));