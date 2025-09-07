import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertNewOrganizationSchema, patchOrganizationSchema, selectNewOrganizationSchema, selectOrganizationSchema } from "@/db/postgres/schemas/organizations/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Organizations"];

export const allOrganizations = createRoute({
  tags,
  path: "/organizations",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectOrganizationSchema),
      "The list of organizations",
    ),
  },
});

export const createOrganization = createRoute({
  tags,
  path: "/organization",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewOrganizationSchema,
      "The organization to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewOrganizationSchema,
      "The created organization",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewOrganizationSchema),
      "The validation error(s)",
    ),
  },
});

export const getOrganization = createRoute({
  tags,
  path: "/organizations/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectOrganizationSchema,
      "The requested organization",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Organization not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patchOrganization = createRoute({
  tags,
  path: "/organizations/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchOrganizationSchema,
      "The organization updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectOrganizationSchema,
      "The updated organization",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Organization not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchOrganizationSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type AllOrganizationsRoute = typeof allOrganizations;
export type CreateOrganizationRoute = typeof createOrganization;
export type GetOrganizationRoute = typeof getOrganization;
export type PatchOrganizationRoute = typeof patchOrganization;
