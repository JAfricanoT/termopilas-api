import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

import { users } from "../../users/schema";

export const user_roles = pgTable("user_roles", {
  id: serial().primaryKey().notNull(),
  name: text().notNull().unique(),
  description: text(),
  created_at: timestamp().defaultNow(),
});

export const user_role_status = pgTable("user_role_status", {
  id: serial().primaryKey().notNull(),
  user_role_id: integer().notNull().references(() => user_roles.id),
  is_active: boolean().notNull().default(false),
  created_by: integer().notNull().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const selectUserRolesSchema = toZodV4SchemaTyped(createSelectSchema(user_roles));
export const insertUserRoleSchema = toZodV4SchemaTyped(createInsertSchema(user_roles)
  .required({
    name: true,
    description: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchUserRoleSchema = insertUserRoleSchema.partial();

export const selectUserRoleStatusSchema = toZodV4SchemaTyped(createSelectSchema(user_role_status));
export const insertUserRoleStatusSchema = toZodV4SchemaTyped(createInsertSchema(user_role_status)
  .required({
    user_role_id: true,
    created_by: true,
  }).omit({
    id: true,
    created_at: true,
  }));

export const selectNewUserRoleSchema = z.object({
  userRole: selectUserRolesSchema,
  status: selectUserRoleStatusSchema.optional(),
});
export const insertNewUserRoleSchema = z.object({
  userRole: insertUserRoleSchema,
  status: insertUserRoleStatusSchema,
});
