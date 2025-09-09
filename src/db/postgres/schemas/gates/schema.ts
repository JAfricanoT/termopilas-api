import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { devices } from "../devices/schema";
import { users } from "../users/schema";

export const gates = pgTable("gates", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const gate_status = pgTable("gate_status", {
  id: serial().primaryKey().notNull(),
  gate_id: integer().notNull().references(() => gates.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const gate_devices = pgTable("gate_devices", {
  id: serial().primaryKey().notNull(),
  gate_id: integer().notNull().references(() => gates.id),
  device_id: integer().notNull().references(() => devices.id),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const gate_device_status = pgTable("gate_device_status", {
  id: serial().primaryKey().notNull(),
  gate_device_id: integer().notNull().references(() => gate_devices.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const selectGatesSchema = toZodV4SchemaTyped(createSelectSchema(gates));
export const insertGateSchema = toZodV4SchemaTyped(createInsertSchema(gates)
  .required({
    name: true,
    description: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchGateSchema = insertGateSchema.partial();

export const selectGateStatusSchema = toZodV4SchemaTyped(createSelectSchema(gate_status));
export const insertGateStatusSchema = toZodV4SchemaTyped(createInsertSchema(gate_status)
  .required({
    user_role_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectNewGateSchema = z.object({
  gate: selectGatesSchema,
  status: selectGateStatusSchema.optional(),
});
export const insertNewGateSchema = z.object({
  gate: insertGateSchema,
  status: insertGateStatusSchema,
});

export const selectGateDevicesSchema = toZodV4SchemaTyped(createSelectSchema(gate_devices));
export const insertGateDeviceSchema = toZodV4SchemaTyped(createInsertSchema(gate_devices)
  .required({
    gate_id: true,
    device_id: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchGateDeviceSchema = insertGateDeviceSchema.partial();

export const selectGateDeviceStatusSchema = toZodV4SchemaTyped(createSelectSchema(gate_device_status));
export const insertGateDeviceStatusSchema = toZodV4SchemaTyped(createInsertSchema(gate_device_status)
  .required({
    user_role_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectNewGateDeviceSchema = z.object({
  gate_device: selectGateDevicesSchema,
  status: selectGateDeviceStatusSchema.optional(),
});
export const insertNewGateDeviceSchema = z.object({
  gate_device: insertGateDeviceSchema,
  status: insertGateDeviceStatusSchema,
});

export const constGateDeviceSchema = z.object({
  devices: z.array(z.number()),
  data: z.object({
    id: z.number(),
    device_id: z.number(),
    created_at: z.date(),
    user_name: z.string(),
    user_last_name: z.string(),
    identity_number: z.number(),
    // Campos opcionales que pueden aparecer en distintos arrays
    errors_id: z.number().optional(),
    errors_name: z.string().optional(),
    action_id: z.number().optional(),
    action_name: z.string().optional(),
    identifier_id: z.number().optional(),
    temporary_identifier_bearer_id: z.number().optional()
  }).optional()
})