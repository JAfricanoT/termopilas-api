import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { device_role_status, device_roles } from "@/db/postgres/schemas/roles/device/schema";

import type { CreateDeviceRoleStatusRoute, GetDeviceRoleStatusRoute } from "./status.routes";

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
