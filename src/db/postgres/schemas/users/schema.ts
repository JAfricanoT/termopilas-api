import { toZodV4SchemaTyped } from "@/lib/zod-utils";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user_roles } from "../roles/schema";

// ! USERS
export const users = pgTable("users", {
  id: serial().primaryKey(),
  lida_id: text().unique(),
  role_id: integer().default(1).references(() => user_roles.id),
  created_at: timestamp().defaultNow(),
});

export const user_status = pgTable("user_status", {
  id: serial().primaryKey(),
  user_id: integer().references(() => users.id),
  is_active: boolean().default(false),
  created_by: integer().references(() => users.id),
  created_at: timestamp().defaultNow(),
});

export const user_information = pgTable("user_information", {
  id: serial().primaryKey(),
  user_id: integer().references(() => users.id),
  username: text().unique(),
  identity_number: integer().unique(),
  created_at: timestamp().defaultNow(),
});

export const selectUserSchema = toZodV4SchemaTyped(createSelectSchema(users));
export const insertUserSchema = toZodV4SchemaTyped(createInsertSchema(
  users,
  {
    lida_id: (field) => field.min(14).max(21),
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