import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertNewActionSchema, patchActionSchema, selectActionsSchema, selectNewActionSchema } from "@/db/postgres/schemas/actions/schema";
import { notFoundSchema } from "@/lib/constants";
const tags = ["Actions"];

export const allActions = createRoute({
  tags,
  path: "/actions",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectActionsSchema),
      "The list of actions",
    ),
  },
});

export const createAction = createRoute({
  tags,
  path: "/actions",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewActionSchema,
      "The action to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewActionSchema,
      "The created action",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewActionSchema),
      "The validation error(s)",
    ),
  },
});

export const getAction = createRoute({
  tags,
  path: "/actions/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectActionsSchema,
      "The requested action",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Action not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patchAction = createRoute({
  tags,
  path: "/actions/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchActionSchema,
      "The action updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectActionsSchema,
      "The updated action",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Action not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchActionSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type AllActionsRoute = typeof allActions;
export type CreateActionRoute = typeof createAction;
export type GetActionRoute = typeof getAction;
export type PatchActionRoute = typeof patchAction;
