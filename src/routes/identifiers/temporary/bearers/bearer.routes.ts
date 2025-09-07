import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertNewTemporaryIdentifierBearerSchema, patchTemporaryIdentifierBearerSchema, patchTemporaryIdentifierSchema, selectNewTemporaryIdentifierBearersSchema, selectTemporaryIdentifierBearersSchema } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Temporary Identifiers"];

export const allTemporaryIdentifierBearers = createRoute({
  tags,
  path: "/identifiers/temporary/bearers",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTemporaryIdentifierBearersSchema),
      "The list of identifiers",
    ),
  },
});

export const createTemporaryIdentifierBearer = createRoute({
  tags,
  path: "/identifiers/temporary/bearers",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewTemporaryIdentifierBearerSchema,
      "The identifier to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewTemporaryIdentifierBearersSchema,
      "The created identifier",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewTemporaryIdentifierBearersSchema),
      "The validation error(s)",
    ),
  },
});

export const getTemporaryIdentifierBearer = createRoute({
  tags,
  path: "/identifiers/temporary/bearers/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTemporaryIdentifierBearersSchema,
      "The requested identifier",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "identifier not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patchTemporaryIdentifierBearer = createRoute({
  tags,
  path: "/identifiers/temporary/bearers/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchTemporaryIdentifierBearerSchema,
      "The identifier updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTemporaryIdentifierBearersSchema,
      "The updated identifier",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Identifier not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchTemporaryIdentifierSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type AllTemporaryIdentifierBearersRoute = typeof allTemporaryIdentifierBearers;
export type CreateTemporaryIdentifierBearerRoute = typeof createTemporaryIdentifierBearer;
export type GetTemporaryIdentifierBearerRoute = typeof getTemporaryIdentifierBearer;
export type PatchTemporaryIdentifierBearerRoute = typeof patchTemporaryIdentifierBearer;
