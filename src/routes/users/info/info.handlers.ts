import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { user_information } from "@/db/postgres/schemas/users/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { CreateUserInformationRoute, GetUserInformationRoute, PatchUserInformationRoute } from "./info.routes";

export const createUserInformation: AppRouteHandler<CreateUserInformationRoute> = async (c) => {
  const newUserInformation = c.req.valid("json");
  const [insertedInformation] = await postgres
    .insert(user_information)
    .values(newUserInformation)
    .returning();
  return c.json(insertedInformation, HttpStatusCodes.OK);
};

export const getUserInformation: AppRouteHandler<GetUserInformationRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedUserInformation] = await postgres
    .select()
    .from(user_information)
    .where(eq(user_information.id, id));

  if (!selectedUserInformation) {
    return c.json(
      {
        message: "User Information not found",
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

  const [updatedUserInformation] = await postgres
    .update(user_information)
    .set(updates)
    .where(eq(user_information.user_id, id))
    .returning();

  if (!updatedUserInformation) {
    return c.json(
      {
        message: "User Information not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedUserInformation, HttpStatusCodes.OK);
};
