import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, SlugParamsSchema } from "stoker/openapi/schemas";

import { insertDeviceStatusSchema, insertNewDeviceSchema, patchDeviceSchema, selectDeviceSchema, selectDeviceStatusSchema, selectNewDeviceSchema } from "@/db/postgres/schemas/devices/schema";
import { selectUserSchema } from "@/db/postgres/schemas/users/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Devices"];

export const allDevices = createRoute({
  tags,
  path: "/devices",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectDeviceSchema),
      "The list of devices",
    ),
  },
});

export const createDevice = createRoute({
  tags,
  path: "/device",
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
      selectDeviceSchema,
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
      selectUserSchema,
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
      selectDeviceSchema,
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
