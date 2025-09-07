import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertDeviceStatusSchema, selectDeviceStatusSchema } from "@/db/postgres/schemas/devices/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Devices"];

export const createDeviceStatus = createRoute({
  tags,
  path: "/devices/status",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertDeviceStatusSchema,
      "The status to update a device",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDeviceStatusSchema,
      "The created status",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectDeviceStatusSchema),
      "The validation error(s)",
    ),
  },
});

export const getDeviceStatus = createRoute({
  tags,
  path: "/devices/status/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDeviceStatusSchema,
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

export type CreateDeviceStatusRoute = typeof createDeviceStatus;
export type GetDeviceStatusRoute = typeof getDeviceStatus;
