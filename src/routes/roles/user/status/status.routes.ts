import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertUserRoleStatusSchema, selectUserRoleStatusSchema } from "@/db/postgres/schemas/roles/user/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["User Roles"];

export const createUserRoleStatus = createRoute({
  tags,
  path: "/roles/user/status",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertUserRoleStatusSchema,
      "The status to update a user role",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserRoleStatusSchema,
      "The created status",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectUserRoleStatusSchema),
      "The validation error(s)",
    ),
  },
});

export const getUserRoleStatus = createRoute({
  tags,
  path: "/roles/user/status/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserRoleStatusSchema,
      "The requested status of a user role",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type CreateUserRoleStatusRoute = typeof createUserRoleStatus;
export type GetUserRoleStatusRoute = typeof getUserRoleStatus;
