import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

import { organizations } from "../../organizations/schema";
import { users } from "../../users/schema";

export const temporary_identifiers = pgTable("temporary_identifiers", {
  id: serial().primaryKey().notNull(),
  temporary_identifier_id: text().notNull().unique(),
  factory_id: text().notNull().unique(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const temporary_identifier_bearers = pgTable("temporary_identifier_bearers", {
  id: serial().primaryKey().notNull(),
  temporary_identifier_id: integer().notNull().references(() => temporary_identifiers.id),
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
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const selectTemporaryIdentifiersSchema = toZodV4SchemaTyped(createSelectSchema(temporary_identifiers));
export const insertTemporaryIdentifierSchema = toZodV4SchemaTyped(createInsertSchema(temporary_identifiers)
  .required({
    temporary_identifier_id: true,
    factory_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchTemporaryIdentifierSchema = insertTemporaryIdentifierSchema.partial();

export const selectTemporaryIdentifierBearersSchema = toZodV4SchemaTyped(createSelectSchema(temporary_identifier_bearers));
export const insertTemporaryIdentifierBearerSchema = toZodV4SchemaTyped(createInsertSchema(temporary_identifier_bearers)
  .required({
    temporary_identifier_id: true,
    user_id: true,
    organization_id: true,
    valid_to: true,
    created_by: true,
  }).omit({
    id: true,
    valid_from: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchTemporaryIdentifierBearerSchema = insertTemporaryIdentifierBearerSchema.partial();

export const selectTemporaryIdentifierBearerStatusSchema = toZodV4SchemaTyped(createSelectSchema(temporary_identifier_bearer_status));
export const insertTemporaryIdentifierBearerStatusSchema = toZodV4SchemaTyped(createInsertSchema(temporary_identifier_bearer_status)
  .required({
    temporary_identifier_bearer_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectNewTemporaryIdentifierBearersSchema = z.object({
  temporaryIdentifierBearer: selectTemporaryIdentifierBearersSchema,
  status: selectTemporaryIdentifierBearerStatusSchema.optional(),
});
export const insertNewTemporaryIdentifierBearerSchema = z.object({
  temporaryIdentifierBearer: insertTemporaryIdentifierBearerSchema,
  status: insertTemporaryIdentifierBearerStatusSchema,
});
