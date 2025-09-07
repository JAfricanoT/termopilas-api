import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { device_status, devices } from "@/db/postgres/schemas/devices/schema";

import type { CreateDeviceStatusRoute, GetDeviceStatusRoute } from "./status.routes";

export const createDeviceStatus: AppRouteHandler<CreateDeviceStatusRoute> = async (c) => {
  const newDeviceStatus = c.req.valid("json");
  const [inserted] = await postgres
    .insert(device_status)
    .values(newDeviceStatus)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getDeviceStatus: AppRouteHandler<GetDeviceStatusRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedDevice] = await postgres
    .select()
    .from(devices)
    .where(eq(devices.device_id, slug));

  const [selectedDeviceStatus] = await postgres
    .select()
    .from(device_status)
    .where(eq(device_status.device_id, selectedDevice.id))
    .orderBy(desc(device_status.id))
    .limit(1);

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
