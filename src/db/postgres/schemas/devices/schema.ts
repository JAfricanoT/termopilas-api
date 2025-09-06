import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

import { device_roles } from "../roles/schema";
import { users } from "../users/schema";

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

export const selectDeviceSchema = toZodV4SchemaTyped(createSelectSchema(devices));
export const insertDeviceSchema = toZodV4SchemaTyped(createInsertSchema(devices)
  .required({
    device_id: true,
    token: true,
    role_id: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchDeviceSchema = insertDeviceSchema.partial();

export const selectDeviceStatusSchema = toZodV4SchemaTyped(createSelectSchema(device_status));
export const insertDeviceStatusSchema = toZodV4SchemaTyped(createInsertSchema(device_status)
  .required({
    device_id: true,
    created_by: true
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectNewDeviceSchema = z.object({
  device: selectDeviceSchema,
  status: selectDeviceStatusSchema.optional(),
});
export const insertNewDeviceSchema = z.object({
  device: insertDeviceSchema,
  status: insertDeviceStatusSchema,
});
