import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { insertUserSchema, selectUserSchema } from "@/db/postgres/schemas/users/schema";
import { createErrorSchema } from "stoker/openapi/schemas";


const tags = ["Users"];

export const allUsers = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUserSchema),
      "The list of users",
    ),
  },
});

export const createUser = createRoute({
  path: "/users",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      insertUserSchema,
      "The task to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserSchema,
      "The created task",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectUserSchema),
      "The validation error(s)",
    ),
  },
  security: [{ bearerAuth: [] }],
});

export type AllUsersRoute = typeof allUsers;
export type CreateUserRoute = typeof createUser;

