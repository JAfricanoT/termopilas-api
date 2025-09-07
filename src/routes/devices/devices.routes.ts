import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertNewDeviceSchema, patchDeviceSchema, selectDevicesSchema, selectNewDeviceSchema } from "@/db/postgres/schemas/devices/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Devices"];

export const allDevices = createRoute({
  tags,
  path: "/devices",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectDevicesSchema),
      "The list of devices",
    ),
  },
});

export const createDevice = createRoute({
  tags,
  path: "/devices",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewDeviceSchema,
      "The device to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewDeviceSchema,
      "The created device",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewDeviceSchema),
      "The validation error(s)",
    ),
  },
});

export const getDevice = createRoute({
  tags,
  path: "/devices/{slug}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: SlugParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDevicesSchema,
      "The requested device",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Device not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patchDevice = createRoute({
  tags,
  path: "/devices/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchDeviceSchema,
      "The device updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDevicesSchema,
      "The updated device",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Device not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchDeviceSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type AllDevicesRoute = typeof allDevices;
export type CreateDeviceRoute = typeof createDevice;
export type GetDeviceRoute = typeof getDevice;
export type PatchDeviceRoute = typeof patchDevice;
