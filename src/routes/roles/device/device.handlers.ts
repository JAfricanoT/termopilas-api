import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { device_role_status, device_roles } from "@/db/postgres/schemas/roles/device/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { AllDeviceRolesRoute, CreateDeviceRoleRoute, CreateDeviceRoleStatusRoute, GetDeviceRoleRoute, GetDeviceRoleStatusRoute, PatchDeviceRoleRoute } from "./device.routes";

export const allDeviceRoles: AppRouteHandler<AllDeviceRolesRoute> = async (c) => {
  const allDeviceRoles = await postgres
    .select()
    .from(device_roles);
  return c.json(allDeviceRoles);
};

export const createDeviceRole: AppRouteHandler<CreateDeviceRoleRoute> = async (c) => {
  const { deviceRole, status } = c.req.valid("json");
  const [insertedDeviceRole] = await postgres
    .insert(device_roles)
    .values(deviceRole)
    .returning();
  // FIX: El device_id deberia ser opcional cuando se crea el device
  status.device_role_id = insertedDeviceRole.id;
  const [insertedStatus] = await postgres
    .insert(device_role_status)
    .values(status)
    .returning();
  const inserted = { deviceRole: insertedDeviceRole, status: insertedStatus };
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getDeviceRole: AppRouteHandler<GetDeviceRoleRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedDeviceRole] = await postgres
    .select()
    .from(device_roles)
    .where(eq(device_roles.id, id));

  if (!selectedDeviceRole) {
    return c.json(
      {
        message: "DeviceRole not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedDeviceRole, HttpStatusCodes.OK);
};

export const patchDeviceRole: AppRouteHandler<PatchDeviceRoleRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [updatedDevice] = await postgres
    .update(device_roles)
    .set(updates)
    .where(eq(device_roles.id, id))
    .returning();

  if (!updatedDevice) {
    return c.json(
      {
        message: "DeviceRole not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedDevice, HttpStatusCodes.OK);
};

export const createDeviceRoleStatus: AppRouteHandler<CreateDeviceRoleStatusRoute> = async (c) => {
  const newDeviceRoleStatus = c.req.valid("json");
  const [inserted] = await postgres
    .insert(device_role_status)
    .values(newDeviceRoleStatus)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getDeviceRoleStatus: AppRouteHandler<GetDeviceRoleStatusRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedDeviceRole] = await postgres
    .select()
    .from(device_roles)
    .where(eq(device_roles.id, id));

  const [selectedDeviceRoleStatus] = await postgres
    .select()
    .from(device_role_status)
    .where(eq(device_role_status.device_role_id, selectedDeviceRole.id))
    .orderBy(desc(device_role_status.id))
    .limit(1);

  if (!selectedDeviceRoleStatus) {
    return c.json(
      {
        message: "DeviceRole Status not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedDeviceRoleStatus, HttpStatusCodes.OK);
};
