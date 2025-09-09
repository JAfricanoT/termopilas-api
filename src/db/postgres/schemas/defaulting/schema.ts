import { boolean, integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";


export const defaulting = pgTable("defaulting", {
  id: serial().primaryKey(),
  identity_number: integer().notNull(),
  is_defaulting: boolean().default(true).notNull(),
  created_at: timestamp().defaultNow(),
});

export const selectDefaultingSchema = toZodV4SchemaTyped(createSelectSchema(defaulting));
export const insertDefaultingSchema = toZodV4SchemaTyped(createInsertSchema(defaulting)
  .required({
    identity_number: true,
    is_defaulting: true,
  }).omit({
    id: true,
    created_at: true,
  }));

// @ts-expect-error partial exists on zod v4 type
export const patchDefaultingSchema = insertDefaultingSchema.partial();
