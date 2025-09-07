import postgres from "@/db/postgres/postgres";
import { action_device_roles, actions } from "@/db/postgres/schemas/actions/schema";
import { devices } from "@/db/postgres/schemas/devices/schema";
import { identifiers } from "@/db/postgres/schemas/identifiers/schema";
import { temporary_identifier_bearer_status, temporary_identifier_bearers, temporary_identifiers } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { temporary_identifier_logs } from "@/db/postgres/schemas/logs/schema";
import { users } from "@/db/postgres/schemas/users/schema";
import type { AppRouteHandler } from "@/lib/types";
import { asc, desc, eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { ExecuteActionRoute } from "./execute.routes";

const PEDESTRIAN_ACTIONS = new Set([
  'PedestrianEntry',
  'PedestrianExit',
  'PedestrianEntryExit',
])


const VEHICLE_ACTIONS = new Set([
  'VehicleEntry',
  'VehicleExit',
  'VehicleEntryExit',
])

const ENTRY_ACTIONS = new Set([
  'PedestrianEntry',
  'PedestrianEntryExit',
  'VehicleEntry',
  'VehicleEntryExit',
])

const EXIT_ACTIONS = new Set([
  'PedestrianExit',
  'PedestrianEntryExit',
  'VehicleExit',
  'VehicleEntryExit',
])

export const executeAction: AppRouteHandler<ExecuteActionRoute> = async (c) => {
  const action = c.req.valid("json");

  const [device] = await postgres
    .select({
      id: devices.id,
      role_id: devices.role_id,
    })
    .from(devices)
    .where(eq(devices.device_id, action.device_id))
    .orderBy(asc(devices.id))
    .limit(1);

  if (!device) {
    return c.json(
      {
        message: "Device not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [identifier] = await postgres
    .select({
      id: identifiers.id,
      identifier_id: identifiers.identifier_id,
      user_id: identifiers.user_id,
      organization_id: identifiers.organization_id,
    })
    .from(identifiers)
    .where(eq(identifiers.factory_id, action.identifier_id))
    .orderBy(asc(identifiers.id))
    .limit(1);

  if (!identifier) {
    c.var.logger.info("")
    console.log("Identifier not found");
    console.log(action.identifier_id);
    const [temporaryIdentifier] = await postgres
      .select({
        id: temporary_identifiers.id,
        temporary_identifier_id: temporary_identifiers.temporary_identifier_id,
      })
      .from(temporary_identifiers)
      .where(eq(temporary_identifiers.factory_id, action.identifier_id))
      .orderBy(asc(temporary_identifiers.id))
      .limit(1);

    console.log({ temporaryIdentifier });
    if (!temporaryIdentifier) {
      return c.json(
        {
          message: "Identifier not found",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const [temporaryIdentifierBearer] = await postgres
      .select({
        id: temporary_identifier_bearers.id,
        user_id: temporary_identifier_bearers.user_id,
        organization_id: temporary_identifier_bearers.organization_id,
        valid_from: temporary_identifier_bearers.valid_from,
        valid_to: temporary_identifier_bearers.valid_to,
      })
      .from(temporary_identifier_bearers)
      .where(eq(temporary_identifier_bearers.temporary_identifier_id, temporaryIdentifier.id))
      .orderBy(desc(temporary_identifier_bearers.id))
      .limit(1);

    console.log('XXX')
    console.log(temporaryIdentifierBearer)
    console.log('XXX')

    if (!temporaryIdentifierBearer) {
      return c.json(
        {
          message: "Temporary Identifier Bearer not found",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const now = new Date();

    if (temporaryIdentifierBearer.valid_from > now || temporaryIdentifierBearer.valid_to < now) {
      return c.json(
        {
          message: "Temporary Identifier Bearer is not valid",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const [temporaryIdentifierBearerStatus] = await postgres
      .select({
        is_active: temporary_identifier_bearer_status.is_active,
        created_by: temporary_identifier_bearer_status.created_by,
        created_at: temporary_identifier_bearer_status.created_at,
      })
      .from(temporary_identifier_bearer_status)
      .where(eq(temporary_identifier_bearer_status.temporary_identifier_bearer_id, temporaryIdentifierBearer.id))
      .orderBy(desc(temporary_identifier_bearer_status.id))
      .limit(1);

    if (!temporaryIdentifierBearerStatus || !temporaryIdentifierBearerStatus.is_active) {
      return c.json(
        {
          message: "Temporary Identifier Bearer is not active",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const userRole = await postgres
      .select({
        lida_id: users.lida_id,
        role_id: users.role_id,
      })
      .from(users)
      .where(eq(users.id, temporaryIdentifierBearer.user_id))
      .orderBy(asc(users.id))
      .limit(1);

    const userLastAction = await postgres
      .select({
        device_id: temporary_identifier_logs.device_id,
        action_id: temporary_identifier_logs.action_id,
      })
      .from(temporary_identifier_logs)
      .where(eq(temporary_identifier_logs.temporary_identifier_id, temporaryIdentifier.id))
      .orderBy(asc(temporary_identifier_logs.id))
      .limit(1);

    const deviceRoleActions = await postgres.select().from(action_device_roles).where(eq(action_device_roles.id, device.role_id));
    const deviceActions = await postgres.select().from(actions).where(inArray(actions.id, deviceRoleActions.map(dra => dra.action_id)))
    const deviceActionsNames = new Set(deviceActions.map(da => da.name));

    const deviceAllowsEntry = (ENTRY_ACTIONS.intersection(deviceActionsNames)).size > 0;
    const deviceAllowsExit = (EXIT_ACTIONS.intersection(deviceActionsNames)).size > 0;
    const deviceAllowsPedestrian = (PEDESTRIAN_ACTIONS.intersection(deviceActionsNames)).size > 0;
    const deviceAllowsVehicle = (VEHICLE_ACTIONS.intersection(deviceActionsNames)).size > 0;

    const executedAction = {
      id: 1,
      identifier_id: 1,
      device_id: 1,
      action_id: 1,
      created_at: new Date(),
    };
    return c.json(executedAction, HttpStatusCodes.OK);
  }

  const userRole = await postgres
    .select({
      lida_id: users.lida_id,
      role_id: users.role_id,
    })
    .from(users)
    .where(eq(users.id, identifier.user_id))
    .orderBy(asc(users.id))
    .limit(1);

  const executedAction = {
    id: 1,
    identifier_id: 1,
    device_id: 1,
    action_id: 1,
    created_at: new Date(),
  };
  return c.json(executedAction, HttpStatusCodes.OK);
};
