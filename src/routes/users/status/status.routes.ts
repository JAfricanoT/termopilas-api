import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertUserStatusSchema, selectUserStatusSchema } from "@/db/postgres/schemas/users/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Users"];

export const createUserStatus = createRoute({
  tags,
  path: "/users/status",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertUserStatusSchema,
      "The status to update an user",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserStatusSchema,
      "The created status",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectUserStatusSchema),
      "The validation error(s)",
    ),
  },
});

export const getUserStatus = createRoute({
  tags,
  path: "/users/status/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserStatusSchema,
      "The requested status of an user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User Status not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type CreateUserStatusRoute = typeof createUserStatus;
export type GetUserStatusRoute = typeof getUserStatus;
