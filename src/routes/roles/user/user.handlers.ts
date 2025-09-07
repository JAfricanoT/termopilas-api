import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { user_role_status, user_roles } from "@/db/postgres/schemas/roles/user/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { AllUserRolesRoute, CreateUserRoleRoute, GetUserRoleRoute, PatchUserRoleRoute } from "./user.routes";

export const allUserRoles: AppRouteHandler<AllUserRolesRoute> = async (c) => {
  const allUserRoles = await postgres
    .select()
    .from(user_roles);
  return c.json(allUserRoles);
};

export const createUserRole: AppRouteHandler<CreateUserRoleRoute> = async (c) => {
  const { userRole, status } = c.req.valid("json");
  const [insertedUserRole] = await postgres
    .insert(user_roles)
    .values(userRole)
    .returning();
  // FIX: El device_id deberia ser opcional cuando se crea el device
  status.user_role_id = insertedUserRole.id;
  const [insertedStatus] = await postgres
    .insert(user_role_status)
    .values(status)
    .returning();
  const inserted = { userRole: insertedUserRole, status: insertedStatus };
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getUserRole: AppRouteHandler<GetUserRoleRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedUserRole] = await postgres
    .select()
    .from(user_roles)
    .where(eq(user_roles.id, id));

  if (!selectedUserRole) {
    return c.json(
      {
        message: "UserRole not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedUserRole, HttpStatusCodes.OK);
};

export const patchUserRole: AppRouteHandler<PatchUserRoleRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [updatedUser] = await postgres
    .update(user_roles)
    .set(updates)
    .where(eq(user_roles.id, id))
    .returning();

  if (!updatedUser) {
    return c.json(
      {
        message: "UserRole not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedUser, HttpStatusCodes.OK);
};
