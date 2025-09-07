import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

import { users } from "../../users/schema";

export const device_roles = pgTable("device_roles", {
  id: serial().primaryKey().notNull(),
  name: text().notNull().unique(),
  description: text(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const device_role_status = pgTable("device_role_status", {
  id: serial().primaryKey().notNull(),
  device_role_id: integer().notNull().references(() => device_roles.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const selectDeviceRolesSchema = toZodV4SchemaTyped(createSelectSchema(device_roles));
export const insertDeviceRoleSchema = toZodV4SchemaTyped(createInsertSchema(device_roles)
  .required({
    name: true,
    description: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchDeviceRoleSchema = insertDeviceRoleSchema.partial();

export const selectDeviceRoleStatusSchema = toZodV4SchemaTyped(createSelectSchema(device_role_status));
export const insertDeviceRoleStatusSchema = toZodV4SchemaTyped(createInsertSchema(device_role_status)
  .required({
    device_role_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectNewDeviceRoleSchema = z.object({
  deviceRole: selectDeviceRolesSchema,
  status: selectDeviceRoleStatusSchema.optional(),
});
export const insertNewDeviceRoleSchema = z.object({
  deviceRole: insertDeviceRoleSchema,
  status: insertDeviceRoleStatusSchema,
});
