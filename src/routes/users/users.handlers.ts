import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { user_information, user_status, users } from "@/db/postgres/schemas/users/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { AllUsersRoute, CreateUserInformationRoute, CreateUserRoute, CreateUserStatusRoute, GetUserInformationRoute, GetUserRoute, GetUserStatusRoute, PatchUserInformationRoute, PatchUserRoute } from "./users.routes";

export const allUsers: AppRouteHandler<AllUsersRoute> = async (c) => {
  const allUsers = await postgres.select().from(users);
  return c.json(allUsers);
};

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const { user, status } = c.req.valid("json");
  const [insertedUser] = await postgres.insert(users).values(user).returning();
  status.user_id = insertedUser.id;
  const [insertedStatus] = await postgres.insert(user_status).values(status).returning();
  const inserted = { user: insertedUser, status: insertedStatus };
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getUser: AppRouteHandler<GetUserRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedUser] = await postgres.select().from(users).where(eq(users.id, id));

  if (!selectedUser) {
    return c.json(
      {
        message: HttpStatusCodes.NOT_FOUND,
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

  const [updatedUser] = await postgres.update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser) {
    return c.json(
      {
        message: HttpStatusCodes.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedUser, HttpStatusCodes.OK);
};

export const createUserStatus: AppRouteHandler<CreateUserStatusRoute> = async (c) => {
  const newUserStatus = c.req.valid("json");
  const [inserted] = await postgres.insert(user_status).values(newUserStatus).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getUserStatus: AppRouteHandler<GetUserStatusRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedUserStatus] = await postgres.select().from(user_status).where(eq(user_status.user_id, id)).orderBy(desc(user_status.id)).limit(1);

  if (!selectedUserStatus) {
    return c.json(
      {
        message: HttpStatusCodes.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedUserStatus, HttpStatusCodes.OK);
};

export const createUserInformation: AppRouteHandler<CreateUserInformationRoute> = async (c) => {
  const newUserInformation = c.req.valid("json");
  const [insertedInformation] = await postgres.insert(user_information).values(newUserInformation).returning();
  return c.json(insertedInformation, HttpStatusCodes.OK);
};

export const getUserInformation: AppRouteHandler<GetUserInformationRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedUserInformation] = await postgres.select().from(user_information).where(eq(user_information.id, id));

  if (!selectedUserInformation) {
    return c.json(
      {
        message: HttpStatusCodes.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedUserInformation, HttpStatusCodes.OK);
};

export const patchUserInformation: AppRouteHandler<PatchUserInformationRoute> = async (c) => {
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

  const [updatedUserInformation] = await postgres.update(user_information)
    .set(updates)
    .where(eq(user_information.user_id, id))
    .returning();

  if (!updatedUserInformation) {
    return c.json(
      {
        message: HttpStatusCodes.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedUserInformation, HttpStatusCodes.OK);
};
