import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertIdentifierStatusSchema, insertNewIdentifierSchema, patchIdentifierSchema, selectIdentifiersSchema, selectIdentifierStatusSchema, selectNewIdentifierSchema } from "@/db/postgres/schemas/identifiers/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Identifiers"];

export const allIdentifiers = createRoute({
  tags,
  path: "/identifiers",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectIdentifiersSchema),
      "The list of identifiers",
    ),
  },
});

export const createIdentifier = createRoute({
  tags,
  path: "/identifiers",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewIdentifierSchema,
      "The identifier to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewIdentifierSchema,
      "The created identifier",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewIdentifierSchema),
      "The validation error(s)",
    ),
  },
});

export const getIdentifier = createRoute({
  tags,
  path: "/identifiers/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIdentifiersSchema,
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

export const patchIdentifier = createRoute({
  tags,
  path: "/identifiers/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchIdentifierSchema,
      "The identifier updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIdentifiersSchema,
      "The updated identifier",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Identifier not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchIdentifierSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type AllIdentifiersRoute = typeof allIdentifiers;
export type CreateIdentifierRoute = typeof createIdentifier;
export type GetIdentifierRoute = typeof getIdentifier;
export type PatchIdentifierRoute = typeof patchIdentifier;

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
