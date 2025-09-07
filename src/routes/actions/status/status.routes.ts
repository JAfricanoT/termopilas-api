import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertActionStatusSchema, selectActionStatusSchema } from "@/db/postgres/schemas/actions/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Actions"];

export const createActionStatus = createRoute({
  tags,
  path: "/actions/status",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertActionStatusSchema,
      "The status to update an action",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectActionStatusSchema,
      "The created status",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectActionStatusSchema),
      "The validation error(s)",
    ),
  },
});

export const getActionStatus = createRoute({
  tags,
  path: "/action/status/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectActionStatusSchema,
      "The requested status of a device",
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

export type CreateActionStatusRoute = typeof createActionStatus;
export type GetActionStatusRoute = typeof getActionStatus;
