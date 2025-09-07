import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { user_information, user_status, users } from "@/db/postgres/schemas/users/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { AllUsersRoute, CreateUserRoute, GetUserRoute, PatchUserRoute } from "./users.routes";

export const allUsers: AppRouteHandler<AllUsersRoute> = async (c) => {
  const allUsers = await postgres
    .select()
    .from(users);
  return c.json(allUsers);
};

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const { user, status, information } = c.req.valid("json");
  const [insertedUser] = await postgres
    .insert(users)
    .values(user)
    .returning();
  status.user_id = insertedUser.id;
  const [insertedStatus] = await postgres
    .insert(user_status)
    .values(status)
    .returning();
  const inserted = { user: insertedUser, status: insertedStatus };
  if (information) {
    information.user_id = insertedUser.id;
    const [insertedInformation] = await postgres
      .insert(user_information)
      .values(information)
      .returning();
    const inserted = { user: insertedUser, status: insertedStatus, information: insertedInformation };
    return c.json(inserted, HttpStatusCodes.OK);
  }
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getUser: AppRouteHandler<GetUserRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedUser] = await postgres
    .select()
    .from(users)
    .where(eq(users.id, id));

  if (!selectedUser) {
    return c.json(
      {
        message: "User not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedUser, HttpStatusCodes.OK);
};

export const patchUser: AppRouteHandler<PatchUserRoute> = async (c) => {
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
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser) {
    return c.json(
      {
        message: "User not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedUser, HttpStatusCodes.OK);
};
