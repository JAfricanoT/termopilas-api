
import type { AppRouteHandler } from "@/lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";

import postgres from "@/db/postgres/postgres";
import { gate_devices, gates } from "@/db/postgres/schemas/gates/schema";

import { actions } from "@/db/postgres/schemas/actions/schema";
import { errors, identifier_errors, temporary_identifier_errors } from "@/db/postgres/schemas/errors/schema";
import { identifiers } from "@/db/postgres/schemas/identifiers/schema";
import { temporary_identifier_bearers } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { identifier_logs, temporary_identifier_logs } from "@/db/postgres/schemas/logs/schema";
import { user_information } from "@/db/postgres/schemas/users/schema";
import { desc, eq, inArray } from "drizzle-orm";
import type { AllGatesRoute, GetGateRoute } from "./gates.routes";

export const allGates: AppRouteHandler<AllGatesRoute> = async (c) => {
  const allGates = await postgres
    .select()
    .from(gates);
  return c.json(allGates);
};

export const getGate: AppRouteHandler<GetGateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const selectedGateDevices = await postgres
    .select()
    .from(gate_devices)
    .where(eq(gate_devices.gate_id, id));

  console.log('Selected Gate Devices: ', selectedGateDevices)

  console.log('Device ID: ', selectedGateDevices.map(sgd => sgd.device_id))

  const deviceIds = selectedGateDevices.map(sgd => sgd.device_id);

  const selectedDevicesLastActionTemporary = await postgres
  .selectDistinctOn([temporary_identifier_logs.device_id],{
    id: temporary_identifier_logs.id,
    device_id: temporary_identifier_logs.device_id,
    action_id: temporary_identifier_logs.action_id,
    action_name: actions.name,
    temporary_identifier_bearer_id: temporary_identifier_logs.temporary_identifier_bearer_id,
    user_name: user_information.name,
    user_last_name: user_information.last_name,
    identity_number: user_information.identity_number,
    created_at: temporary_identifier_logs.created_at,
  })
  .from(temporary_identifier_logs)
  .leftJoin(temporary_identifier_bearers, eq(temporary_identifier_logs.temporary_identifier_bearer_id, temporary_identifier_bearers.id))
  .leftJoin(user_information, eq(temporary_identifier_bearers.user_id, user_information.user_id))
  .leftJoin(actions, eq(temporary_identifier_logs.action_id, actions.id))
  .where(inArray(temporary_identifier_logs.device_id, deviceIds))
  .orderBy(
    temporary_identifier_logs.device_id,
    desc(temporary_identifier_logs.created_at)
  )

  const selectedDevicesLastErrorTemporary = await postgres
  .selectDistinctOn([temporary_identifier_errors.device_id],{
    id: temporary_identifier_errors.id,
    device_id: temporary_identifier_errors.device_id,
    errors_id: temporary_identifier_errors.error_id,
    errors_name: errors.name,
    temporary_identifier_bearer_id: temporary_identifier_errors.temporary_identifier_bearer_id,
    user_name: user_information.name,
    user_last_name: user_information.last_name,
    identity_number: user_information.identity_number,
    created_at: temporary_identifier_errors.created_at,
  })
  .from(temporary_identifier_errors)
  .leftJoin(temporary_identifier_bearers, eq(temporary_identifier_errors.temporary_identifier_bearer_id, temporary_identifier_bearers.id))
  .leftJoin(user_information, eq(temporary_identifier_bearers.user_id, user_information.user_id))
  .leftJoin(errors, eq(temporary_identifier_errors.error_id, errors.id))
  .where(inArray(temporary_identifier_errors.device_id, deviceIds))
  .orderBy(
    temporary_identifier_errors.device_id,
    desc(temporary_identifier_errors.created_at)
  );

  console.log("xxxxx")
  console.log(selectedDevicesLastActionTemporary)
  console.log(selectedDevicesLastErrorTemporary)
  console.log("xxxxx")

  const selectedDevicesLastAction = await postgres
  .selectDistinctOn([identifier_logs.device_id],{
    id: identifier_logs.id,
    device_id: identifier_logs.device_id,
    action_id: identifier_logs.action_id,
    action_name: actions.name,
    identifier_id: identifier_logs.identifier_id,
    user_name: user_information.name,
    user_last_name: user_information.last_name,
    identity_number: user_information.identity_number,
    created_at: identifier_logs.created_at,
  })
  .from(identifier_logs)
  .leftJoin(identifiers, eq(identifier_logs.identifier_id, identifiers.id))
  .leftJoin(user_information, eq(identifiers.user_id, user_information.user_id))
  .leftJoin(actions, eq(identifier_logs.action_id, actions.id))
  .where(inArray(identifier_logs.device_id, deviceIds))
  .orderBy(
    identifier_logs.device_id,
    desc(identifier_logs.created_at)
  )

  const selectedDevicesLastError = await postgres
  .selectDistinctOn([identifier_errors.device_id],{
    id: identifier_errors.id,
    device_id: identifier_errors.device_id,
    errors_id: identifier_errors.error_id,
    errors_name: errors.name,
    identifier_id: identifier_errors.identifier_id,
    user_name: user_information.name,
    user_last_name: user_information.last_name,
    identity_number: user_information.identity_number,
    created_at: identifier_errors.created_at,
  })
  .from(identifier_errors)
  .leftJoin(identifiers, eq(identifier_errors.identifier_id, identifiers.id))
  .leftJoin(user_information, eq(identifiers.user_id, user_information.user_id))
  .leftJoin(errors, eq(identifier_errors.error_id, errors.id))
  .where(inArray(identifier_errors.device_id, deviceIds))
  .orderBy(
    identifier_errors.device_id,
    desc(identifier_errors.created_at)
  );


  console.log('xxxxxx')
  console.log('Selected Gate Devices Last Action: ', selectedDevicesLastAction)
  console.log('Selected Gate Devices Last Action: ', selectedDevicesLastError)
  console.log('xxxxxx')

  type DeviceRecord = {
    id: number;
    device_id: number;
    created_at: Date;
    user_name: string;
    user_last_name: string;
    identity_number: number;
    // Campos opcionales que pueden aparecer en distintos arrays
    errors_id?: number;
    errors_name?: string;
    action_id?: number;
    action_name?: string;
    identifier_id?: number;
    temporary_identifier_bearer_id?: number;
  };


  function mergeAndFilterLatest(...arrays: DeviceRecord[]): DeviceRecord[] {
    const map = new Map<number, DeviceRecord>();

    arrays.flat().forEach(item => {
      const current = map.get(item.device_id);
      if (!current || new Date(item.created_at) > new Date(current.created_at)) {
        map.set(item.device_id, item);
      }
    });

    return Array.from(map.values()).sort((a, b) => a.device_id - b.device_id);
  }
  
  const result: DeviceRecord[] = mergeAndFilterLatest(selectedDevicesLastActionTemporary, selectedDevicesLastErrorTemporary, selectedDevicesLastAction, selectedDevicesLastError);

  const response = {
    devices: deviceIds,
    data: result
  }

  return c.json(response, HttpStatusCodes.OK);
};