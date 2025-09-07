import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { user_role_status, user_roles } from "@/db/postgres/schemas/roles/user/schema";

import type { CreateUserRoleStatusRoute, GetUserRoleStatusRoute } from "./status.routes";

export const createUserRoleStatus: AppRouteHandler<CreateUserRoleStatusRoute> = async (c) => {
  const newUserRoleStatus = c.req.valid("json");
  const [inserted] = await postgres
    .insert(user_role_status)
    .values(newUserRoleStatus)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getUserRoleStatus: AppRouteHandler<GetUserRoleStatusRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedUserRole] = await postgres
    .select()
    .from(user_roles)
    .where(eq(user_roles.id, id));

  const [selectedUserRoleStatus] = await postgres
    .select()
    .from(user_role_status)
    .where(eq(user_role_status.user_role_id, selectedUserRole.id))
    .orderBy(desc(user_role_status.id))
    .limit(1);

  if (!selectedUserRoleStatus) {
    return c.json(
      {
        message: "UserRole Status not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedUserRoleStatus, HttpStatusCodes.OK);
};
