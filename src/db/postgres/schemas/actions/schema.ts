import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { device_roles } from "../roles/device/schema";
import { user_roles } from "../roles/user/schema";
import { users } from "../users/schema";

export const actions = pgTable("actions", {
  id: serial().primaryKey().notNull(),
  name: text().notNull().unique(),
  description: text(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const action_status = pgTable("action_status", {
  id: serial().primaryKey().notNull(),
  action_id: integer().notNull().references(() => actions.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const action_device_roles = pgTable("action_device_roles", {
  id: serial().primaryKey().notNull(),
  action_id: integer().notNull().references(() => actions.id),
  device_role_id: integer().notNull().references(() => device_roles.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const action_user_roles = pgTable("action_user_roles", {
  id: serial().primaryKey().notNull(),
  action_id: integer().notNull().references(() => actions.id),
  user_role_id: integer().notNull().references(() => user_roles.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});


export const selectActionsSchema = toZodV4SchemaTyped(createSelectSchema(actions));
export const insertActionSchema = toZodV4SchemaTyped(createInsertSchema(actions)
  .required({
    name: true,
    description: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchActionSchema = insertActionSchema.partial();

export const selectActionStatusSchema = toZodV4SchemaTyped(createSelectSchema(action_status));
export const insertActionStatusSchema = toZodV4SchemaTyped(createInsertSchema(action_status)
  .required({
    action_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectNewActionSchema = z.object({
  action: selectActionsSchema,
  status: selectActionStatusSchema.optional(),
});

export const insertNewActionSchema = z.object({
  action: insertActionSchema,
  status: insertActionStatusSchema,
});

