
import type { AppRouteHandler } from "@/lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";

import postgres from "@/db/postgres/postgres";
import { users } from "@/db/postgres/schemas/users/schema";
import type { AllUsersRoute, CreateUserRoute } from "./users.routes";

export const allUsers: AppRouteHandler<AllUsersRoute> = async (c) => {
  const allUsers = await postgres.select().from(users);
  return c.json(allUsers);
};

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const newUser = c.req.valid("json");
  const [inserted] = await postgres.insert(users).values(newUser).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};