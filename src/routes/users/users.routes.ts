import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertNewUserSchema, insertUserInformationSchema, insertUserStatusSchema, patchUserInformationSchema, patchUserSchema, selectNewUserSchema, selectUserInformationSchema, selectUserSchema, selectUserStatusSchema } from "@/db/postgres/schemas/users/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Users"];

export const allUsers = createRoute({
  tags,
  path: "/users",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUserSchema),
      "The list of users",
    ),
  },
});

export const createUser = createRoute({
  tags,
  path: "/users",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewUserSchema,
      "The user to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewUserSchema,
      "The created user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewUserSchema),
      "The validation error(s)",
    ),
  },
});

export const getUser = createRoute({
  tags,
  path: "/users/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserSchema,
      "The requested user",
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

export const patchUser = createRoute({
  tags,
  path: "/users/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchUserSchema,
      "The user updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserSchema,
      "The updated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchUserSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type AllUsersRoute = typeof allUsers;
export type CreateUserRoute = typeof createUser;
export type GetUserRoute = typeof getUser;
export type PatchUserRoute = typeof patchUser;

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

export const createUserInformation = createRoute({
  tags,
  path: "/users/info",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertUserInformationSchema,
      "The user information to assign an user",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserInformationSchema,
      "The information assigned to an user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectUserInformationSchema),
      "The validation error(s)",
    ),
  },
});

export const getUserInformation = createRoute({
  tags,
  path: "/users/info/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserInformationSchema,
      "The requested user information",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User Information not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patchUserInformation = createRoute({
  tags,
  path: "/users/info/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchUserInformationSchema,
      "The user information updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserInformationSchema,
      "The updated user information",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchUserInformationSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type CreateUserInformationRoute = typeof createUserInformation;
export type GetUserInformationRoute = typeof getUserInformation;
export type PatchUserInformationRoute = typeof patchUserInformation;
