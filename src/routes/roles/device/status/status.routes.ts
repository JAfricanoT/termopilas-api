import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertDeviceRoleStatusSchema, selectDeviceRoleStatusSchema } from "@/db/postgres/schemas/roles/device/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Device Roles"];

export const createDeviceRoleStatus = createRoute({
  tags,
  path: "/roles/device/status",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertDeviceRoleStatusSchema,
      "The status to update a device role",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDeviceRoleStatusSchema,
      "The created status",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectDeviceRoleStatusSchema),
      "The validation error(s)",
    ),
  },
});

export const getDeviceRoleStatus = createRoute({
  tags,
  path: "/roles/device/status/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDeviceRoleStatusSchema,
      "The requested status of a device role",
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

export type CreateDeviceRoleStatusRoute = typeof createDeviceRoleStatus;
export type GetDeviceRoleStatusRoute = typeof getDeviceRoleStatus;
