import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertTemporaryIdentifierBearerStatusSchema, selectTemporaryIdentifierBearerStatusSchema } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Temporary Identifiers"];

export const createTemporaryIdentifierBearerStatus = createRoute({
  tags,
  path: "/identifiers/temporary/bearers/status",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertTemporaryIdentifierBearerStatusSchema,
      "The status to update a identifier",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTemporaryIdentifierBearerStatusSchema,
      "The created status",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectTemporaryIdentifierBearerStatusSchema),
      "The validation error(s)",
    ),
  },
});

export const getTemporaryIdentifierBearerStatus = createRoute({
  tags,
  path: "/identifiers/temporary/bearers/status/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTemporaryIdentifierBearerStatusSchema,
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

export type CreateTemporaryIdentifierBearerStatusRoute = typeof createTemporaryIdentifierBearerStatus;
export type GetTemporaryIdentifierBearerStatusRoute = typeof getTemporaryIdentifierBearerStatus;
