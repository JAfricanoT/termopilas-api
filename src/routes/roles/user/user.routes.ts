import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertNewUserRoleSchema, insertUserRoleStatusSchema, patchUserRoleSchema, selectNewUserRoleSchema, selectUserRolesSchema, selectUserRoleStatusSchema } from "@/db/postgres/schemas/roles/user/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["User Roles"];

export const allUserRoles = createRoute({
  tags,
  path: "/roles/user",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUserRolesSchema),
      "The list of user roles",
    ),
  },
});

export const createUserRole = createRoute({
  tags,
  path: "/roles/user",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewUserRoleSchema,
      "The user role to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewUserRoleSchema,
      "The created user role",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewUserRoleSchema),
      "The validation error(s)",
    ),
  },
});

export const getUserRole = createRoute({
  tags,
  path: "/roles/user/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserRolesSchema,
      "The requested user role",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "UserRole not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patchUserRole = createRoute({
  tags,
  path: "/roles/user/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchUserRoleSchema,
      "The user role updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserRolesSchema,
      "The updated user role",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "UserRole not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchUserRoleSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type AllUserRolesRoute = typeof allUserRoles;
export type CreateUserRoleRoute = typeof createUserRole;
export type GetUserRoleRoute = typeof getUserRole;
export type PatchUserRoleRoute = typeof patchUserRole;

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
