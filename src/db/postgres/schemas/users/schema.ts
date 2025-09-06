import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

import { user_roles } from "../roles/schema";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  lida_id: text().unique().notNull(),
  role_id: integer().default(3).notNull().references(() => user_roles.id),
  created_at: timestamp().defaultNow(),
});

export const user_status = pgTable("user_status", {
  id: serial().primaryKey(),
  user_id: integer().notNull().references(() => users.id),
  is_active: boolean().default(false).notNull(),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const user_information = pgTable("user_information", {
  id: serial().primaryKey(),
  user_id: integer().notNull().references(() => users.id),
  username: text().unique().notNull(),
  identity_number: integer().unique().notNull(),
  modified_at: timestamp().defaultNow().$onUpdate(() => new Date()).notNull(),
  created_at: timestamp().defaultNow(),
});

export const selectUserSchema = toZodV4SchemaTyped(createSelectSchema(users));
export const insertUserSchema = toZodV4SchemaTyped(createInsertSchema(
  users,
  {
    lida_id: field => field.min(14).max(21),
  },
).required({
  lida_id: true,
  role_id: true,
}).omit({
  id: true,
  created_at: true,
}));

// @ts-expect-error partial exists on zod v4 type
export const patchUserSchema = insertUserSchema.partial();

export const selectUserStatusSchema = toZodV4SchemaTyped(createSelectSchema(user_status));

export const insertUserStatusSchema = toZodV4SchemaTyped(createInsertSchema(user_status)
  .required({
    user_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectUserInformationSchema = toZodV4SchemaTyped(createSelectSchema(user_information));
export const insertUserInformationSchema = toZodV4SchemaTyped(createInsertSchema(user_information)
  .required({
    user_id: true,
    username: true,
    identity_number: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchUserInformationSchema = insertUserInformationSchema.partial();

export const selectNewUserSchema = z.object({
  user: selectUserSchema,
  status: selectUserStatusSchema,
});
export const insertNewUserSchema = z.object({
  user: insertUserSchema,
  status: insertUserStatusSchema,
});
