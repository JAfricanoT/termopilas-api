import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

import { users } from "../users/schema";

export const organizations = pgTable("organizations", {
  id: serial().primaryKey().notNull(),
  organization_id: text().notNull().unique(),
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

export const selectOrganizationSchema = toZodV4SchemaTyped(createSelectSchema(organizations));
export const insertOrganizationSchema = toZodV4SchemaTyped(createInsertSchema(organizations)
  .required({
    organization_id: true,
    name: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchOrganizationSchema = insertOrganizationSchema.partial();

export const selectOrganizationStatusSchema = toZodV4SchemaTyped(createSelectSchema(organization_status));
export const insertOrganizationStatusSchema = toZodV4SchemaTyped(createInsertSchema(organization_status)
  .required({
    organization_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectNewOrganizationSchema = z.object({
  organization: selectOrganizationSchema,
  status: selectOrganizationStatusSchema.optional(),
});
export const insertNewOrganizationSchema = z.object({
  organization: insertOrganizationSchema,
  status: insertOrganizationStatusSchema,
});
