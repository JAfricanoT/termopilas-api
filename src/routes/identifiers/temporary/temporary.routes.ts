import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertNewTemporaryIdentifierBearerSchema, insertTemporaryIdentifierBearerStatusSchema, insertTemporaryIdentifierSchema, patchTemporaryIdentifierBearerSchema, patchTemporaryIdentifierSchema, selectNewTemporaryIdentifierBearersSchema, selectTemporaryIdentifierBearersSchema, selectTemporaryIdentifierBearerStatusSchema, selectTemporaryIdentifiersSchema } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Temporary Identifiers"];

export const allTemporaryIdentifiers = createRoute({
  tags,
  path: "/identifiers/temporary",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTemporaryIdentifiersSchema),
      "The list of identifiers",
    ),
  },
});

export const createTemporaryIdentifier = createRoute({
  tags,
  path: "/identifiers/temporary",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertTemporaryIdentifierSchema,
      "The identifier to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTemporaryIdentifiersSchema,
      "The created identifier",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectTemporaryIdentifiersSchema),
      "The validation error(s)",
    ),
  },
});

export const getTemporaryIdentifier = createRoute({
  tags,
  path: "/identifiers/temporary/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTemporaryIdentifiersSchema,
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

export const patchTemporaryIdentifier = createRoute({
  tags,
  path: "/identifiers/temporary/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchTemporaryIdentifierSchema,
      "The identifier updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTemporaryIdentifiersSchema,
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

export type AllTemporaryIdentifiersRoute = typeof allTemporaryIdentifiers;
export type CreateTemporaryIdentifierRoute = typeof createTemporaryIdentifier;
export type GetTemporaryIdentifierRoute = typeof getTemporaryIdentifier;
export type PatchTemporaryIdentifierRoute = typeof patchTemporaryIdentifier;

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
