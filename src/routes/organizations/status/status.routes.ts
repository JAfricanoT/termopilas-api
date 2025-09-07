import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertOrganizationStatusSchema, selectOrganizationStatusSchema } from "@/db/postgres/schemas/organizations/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Organizations"];

export const createOrganizationStatus = createRoute({
  tags,
  path: "/organizations/status",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertOrganizationStatusSchema,
      "The status to update a organization",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectOrganizationStatusSchema,
      "The created status",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectOrganizationStatusSchema),
      "The validation error(s)",
    ),
  },
});

export const getOrganizationStatus = createRoute({
  tags,
  path: "/organizations/status/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectOrganizationStatusSchema,
      "The requested status of a organization",
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

export type CreateOrganizationStatusRoute = typeof createOrganizationStatus;
export type GetOrganizationStatusRoute = typeof getOrganizationStatus;
