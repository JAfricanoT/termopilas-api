import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertIdentifierStatusSchema, selectIdentifierStatusSchema } from "@/db/postgres/schemas/identifiers/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Identifiers"];

export const createIdentifierStatus = createRoute({
  tags,
  path: "/identifiers/status",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertIdentifierStatusSchema,
      "The status to update a identifier",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIdentifierStatusSchema,
      "The created status",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectIdentifierStatusSchema),
      "The validation error(s)",
    ),
  },
});

export const getIdentifierStatus = createRoute({
  tags,
  path: "/identifiers/status/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIdentifierStatusSchema,
      "The requested status of a identifier",
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

export type CreateIdentifierStatusRoute = typeof createIdentifierStatus;
export type GetIdentifierStatusRoute = typeof getIdentifierStatus;
