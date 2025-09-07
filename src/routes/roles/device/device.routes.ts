import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertDeviceRoleStatusSchema, insertNewDeviceRoleSchema, patchDeviceRoleSchema, selectDeviceRolesSchema, selectDeviceRoleStatusSchema, selectNewDeviceRoleSchema } from "@/db/postgres/schemas/roles/device/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Device Roles"];

export const allDeviceRoles = createRoute({
  tags,
  path: "/roles/device",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectDeviceRolesSchema),
      "The list of device roles",
    ),
  },
});

export const createDeviceRole = createRoute({
  tags,
  path: "/roles/device",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewDeviceRoleSchema,
      "The device role to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewDeviceRoleSchema,
      "The created device role",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewDeviceRoleSchema),
      "The validation error(s)",
    ),
  },
});

export const getDeviceRole = createRoute({
  tags,
  path: "/roles/device/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDeviceRolesSchema,
      "The requested device role",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "DeviceRole not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patchDeviceRole = createRoute({
  tags,
  path: "/roles/device/{id}",
  method: "patch",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchDeviceRoleSchema,
      "The device role updates",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectDeviceRolesSchema,
      "The updated device role",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "DeviceRole not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchDeviceRoleSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type AllDeviceRolesRoute = typeof allDeviceRoles;
export type CreateDeviceRoleRoute = typeof createDeviceRole;
export type GetDeviceRoleRoute = typeof getDeviceRole;
export type PatchDeviceRoleRoute = typeof patchDeviceRole;

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
