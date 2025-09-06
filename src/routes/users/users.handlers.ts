
import type { AppRouteHandler } from "@/lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";

import postgres from "@/db/postgres/postgres";
import { users } from "@/db/postgres/schemas/users/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { PatchRoute } from "../keys/keys.routes";
import type { AllUsersRoute, CreateUserRoute, GetUserRoute } from "./users.routes";

export const allUsers: AppRouteHandler<AllUsersRoute> = async (c) => {
  const allUsers = await postgres.select().from(users);
  return c.json(allUsers);
};

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const newUser = c.req.valid("json");
  const [inserted] = await postgres.insert(users).values(newUser).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getUser: AppRouteHandler<GetUserRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const selectedUser = await postgres.select().from(users).where(eq(users.id, id));
  
  if (!selectedUser.length) {
    return c.json(
      {
        message: HttpStatusCodes.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  
  return c.json(selectedUser, HttpStatusCodes.OK);
};

export const patchUser: AppRouteHandler<PatchRoute> = async (c) => {
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

