import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { organizations } from "../organizations/schema";
import { users } from "../users/schema";

export const identifiers = pgTable("identifiers", {
  id: serial().primaryKey().notNull(),
  identifier_id: text().notNull().unique(),
  factory_id: text().notNull().unique(),
  user_id: integer().notNull().references(() => users.id),
  organization_id: integer().notNull().references(() => organizations.id),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const identifier_status = pgTable("identifier_status", {
  id: serial().primaryKey().notNull(),
  identifier_id: integer().notNull().references(() => identifiers.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const selectIdentifiersSchema = toZodV4SchemaTyped(createSelectSchema(identifiers));
export const insertIdentifierSchema = toZodV4SchemaTyped(createInsertSchema(identifiers)
  .required({
    identifier_id: true,
    factory_id: true,
    user_id: true,
    organization_id: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchIdentifierSchema = insertIdentifierSchema.partial();

export const selectIdentifierStatusSchema = toZodV4SchemaTyped(createSelectSchema(identifier_status));
export const insertIdentifierStatusSchema = toZodV4SchemaTyped(createInsertSchema(identifier_status)
.required({
  identifier_id: true,
  created_by: true,
}).omit({
  id: true,
  created_at: true,
}));

export const selectNewIdentifierSchema = z.object({
  identifier: selectIdentifiersSchema,
  status: selectIdentifierStatusSchema.optional(),
});
export const insertNewIdentifierSchema = z.object({
  identifier: insertIdentifierSchema,
  status: insertIdentifierStatusSchema,
});
