import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { device_status, devices } from "@/db/postgres/schemas/devices/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { AllDevicesRoute, CreateDeviceRoute, CreateDeviceStatusRoute, GetDeviceRoute, GetDeviceStatusRoute, PatchDeviceRoute } from "./devices.routes";

export const allDevices: AppRouteHandler<AllDevicesRoute> = async (c) => {
  const allDevices = await postgres.select().from(devices);
  return c.json(allDevices);
};

export const createDevice: AppRouteHandler<CreateDeviceRoute> = async (c) => {
  const { device, status } = c.req.valid("json");
  const [insertedDevice] = await postgres.insert(devices).values(device).returning();
  // FIX: El device_id deberia ser opcional cuando se crea el device
  status.device_id = insertedDevice.id;
  const [insertedStatus] = await postgres.insert(device_status).values(status).returning();
  const inserted = { device: insertedDevice, status: insertedStatus };
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getDevice: AppRouteHandler<GetDeviceRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedDevice] = await postgres.select().from(devices).where(eq(devices.device_id, slug));

  if (!selectedDevice) {
    return c.json(
      {
        message: "Device not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedDevice, HttpStatusCodes.OK);
};

export const patchDevice: AppRouteHandler<PatchDeviceRoute> = async (c) => {
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

  const [updatedUser] = await postgres.update(devices)
    .set(updates)
    .where(eq(devices.id, id))
    .returning();

  if (!updatedUser) {
    return c.json(
      {
        message: "Device not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedUser, HttpStatusCodes.OK);
};

export const createDeviceStatus: AppRouteHandler<CreateDeviceStatusRoute> = async (c) => {
  const newDeviceStatus = c.req.valid("json");
  const [inserted] = await postgres.insert(device_status).values(newDeviceStatus).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getDeviceStatus: AppRouteHandler<GetDeviceStatusRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedDevice] = await postgres.select().from(devices).where(eq(devices.device_id, slug));

  const [selectedDeviceStatus] = await postgres.select().from(device_status).where(eq(device_status.device_id, selectedDevice.id)).orderBy(desc(device_status.id)).limit(1);

  if (!selectedDeviceStatus) {
    return c.json(
      {
        message: "Device Status not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedDeviceStatus, HttpStatusCodes.OK);
};
