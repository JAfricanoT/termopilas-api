import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { user_status } from "@/db/postgres/schemas/users/schema";

import type { CreateUserStatusRoute, GetUserStatusRoute } from "./status.routes";

export const createUserStatus: AppRouteHandler<CreateUserStatusRoute> = async (c) => {
  const newUserStatus = c.req.valid("json");
  const [inserted] = await postgres
    .insert(user_status)
    .values(newUserStatus)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getUserStatus: AppRouteHandler<GetUserStatusRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedUserStatus] = await postgres
    .select()
    .from(user_status)
    .where(eq(user_status.user_id, id))
    .orderBy(desc(user_status.id))
    .limit(1);

  if (!selectedUserStatus) {
    return c.json(
      {
        message: "User Status not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedUserStatus, HttpStatusCodes.OK);
};