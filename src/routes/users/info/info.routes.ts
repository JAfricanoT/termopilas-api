import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertUserInformationSchema, patchUserInformationSchema, selectUserInformationSchema } from "@/db/postgres/schemas/users/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Users"];

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
